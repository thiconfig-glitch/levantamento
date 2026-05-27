import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDi7RXy9KSagQIrjkjEhKM7g_FZysXrpx0",
    authDomain: "levantamento2026-918f5.firebaseapp.com",
    projectId: "levantamento2026-918f5",
    storageBucket: "levantamento2026-918f5.firebasestorage.app",
    messagingSenderId: "414332716833",
    appId: "1:414332716833:web:9084f88a76e623c6d12060"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nomesLivrosAdmin = {
    'biblia': 'Bíblia', 'somos3': 'Somos 3', 'carater': 'Caráter',
    'arrependimento': 'Arrepend.', 'avivamento': 'Avivam.',
    'filhoDono': 'Filho Dono', 'virgens': '10 Virgens', 'ovelha': 'Ovelha'
};

let registrosGlobais = [];
const corpoTabela = document.getElementById('corpo-tabela');
const seletorFiltro = document.getElementById('filtro-bloco');

const q = query(collection(db, "distribuicoes"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    registrosGlobais = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        registrosGlobais.push({
            id: doc.id,
            timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
            bloco: data.bloco,
            regiao: data.regiao,
            igreja: data.igreja,
            livros: data.livros
        });
    });
    
    atualizarFiltros();
    renderizarTabela(registrosGlobais);
    calcularKPIs(registrosGlobais);
}, (error) => {
    console.error("Erro ao ler o banco:", error);
    corpoTabela.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">Erro de permissão no Firebase ou aguardando conexão...</td></tr>';
});

function atualizarFiltros() {
    const blocosUnicos = [...new Set(registrosGlobais.map(r => r.bloco))];
    const valorAtual = seletorFiltro.value;
    
    seletorFiltro.innerHTML = '<option value="TODOS">Visualizar Todos os Blocos</option>';
    blocosUnicos.forEach(bloco => {
        const option = document.createElement('option');
        option.value = bloco;
        option.textContent = bloco;
        seletorFiltro.appendChild(option);
    });
    
    if (blocosUnicos.includes(valorAtual)) {
        seletorFiltro.value = valorAtual;
    }
}

function renderizarTabela(dados) {
    corpoTabela.innerHTML = '';
    if (dados.length === 0) {
        corpoTabela.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum registo encontrado no banco.</td></tr>';
        return;
    }

    dados.forEach(reg => {
        const dataFormatada = reg.timestamp.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        const stringLivros = Object.entries(reg.livros)
            .filter(([_, qtd]) => qtd > 0)
            .map(([chave, qtd]) => `<strong>${nomesLivrosAdmin[chave]}:</strong> ${qtd}`).join(' | ');

        corpoTabela.innerHTML += `
            <tr>
                <td>${dataFormatada}</td>
                <td style="font-weight: bold; color: #0a162d;">${reg.bloco}</td>
                <td>${reg.regiao}</td>
                <td>${reg.igreja}</td>
                <td>${stringLivros}</td>
            </tr>`;
    });
}

function calcularKPIs(dados) {
    let totalLivros = 0;
    dados.forEach(reg => {
        totalLivros += Object.values(reg.livros).reduce((soma, qtd) => soma + qtd, 0);
    });

    document.getElementById('kpi-total').textContent = totalLivros;

    if (dados.length > 0) {
        const ultimaAcao = dados[0].timestamp.toLocaleTimeString('pt-BR', { timeStyle: 'short' });
        document.getElementById('kpi-ultima-acao').textContent = ultimaAcao;
    } else {
        document.getElementById('kpi-ultima-acao').textContent = "--:--";
    }
}

seletorFiltro.addEventListener('change', (e) => {
    const blocoSelecionado = e.target.value;
    if (blocoSelecionado === "TODOS") {
        renderizarTabela(registrosGlobais);
        calcularKPIs(registrosGlobais);
    } else {
        const dadosFiltrados = registrosGlobais.filter(r => r.bloco === blocoSelecionado);
        renderizarTabela(dadosFiltrados);
        calcularKPIs(dadosFiltrados);
    }
});

document.getElementById('btn-exportar').addEventListener('click', () => {
    const blocoSelecionado = seletorFiltro.value;
    let dadosParaExportar = registrosGlobais;
    
    if (blocoSelecionado !== "TODOS") {
        dadosParaExportar = registrosGlobais.filter(r => r.bloco === blocoSelecionado);
    }

    if (dadosParaExportar.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    const chavesLivros = Object.keys(nomesLivrosAdmin);
    const cabecalhoLivros = chavesLivros.map(chave => nomesLivrosAdmin[chave]).join(';');
    
    let csvContent = "Data/Hora;Bloco;Regiao;Cenaculo;" + cabecalhoLivros + "\n";

    dadosParaExportar.forEach(reg => {
        const dataFormatada = reg.timestamp.toLocaleString('pt-BR');
        let linha = `"${dataFormatada}";"${reg.bloco}";"${reg.regiao}";"${reg.igreja}"`;
        
        chavesLivros.forEach(chave => {
            const qtd = reg.livros && reg.livros[chave] ? reg.livros[chave] : 0;
            linha += `;${qtd}`;
        });
        
        csvContent += linha + "\n";
    });

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const dataAtual = new Date().toISOString().slice(0,10);
    a.download = `exportacao_${blocoSelecionado !== 'TODOS' ? blocoSelecionado : 'todos'}_${dataAtual}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
