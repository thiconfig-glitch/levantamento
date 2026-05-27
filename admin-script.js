import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const todosOsBlocos = [
    "BELO HORIZONTE", "BETIM", "CATEDRAL", "CONSELHEIRO LAFAIETE", "DIVINOPOLIS",
    "ELDORADO", "GOVERNADOR VALADARES", "ITABIRA", "JUIZ DE FORA", "MONTES CLAROS",
    "SETE LAGOAS", "TEOFILO OTONI", "UBÁ", "UBERABA", "UBERLANDIA", "VARGINHA", "VENDA NOVA"
];

const limitesBlocos = {
    "BELO HORIZONTE": { "biblia": 95, "somos3": 22, "carater": 14, "arrependimento": 18, "avivamento": 11, "filhoDono": 25, "virgens": 16, "ovelha": 20 },
    "BETIM": { "biblia": 50, "somos3": 0, "carater": 5, "arrependimento": 0, "avivamento": 0, "filhoDono": 40, "virgens": 0, "ovelha": 1 },
    "CATEDRAL": { "biblia": 26, "somos3": 55, "carater": 38, "arrependimento": 18, "avivamento": 23, "filhoDono": 8, "virgens": 55, "ovelha": 53 },
    "CONSELHEIRO LAFAIETE": { "biblia": 11, "somos3": 0, "carater": 0, "arrependimento": 0, "avivamento": 0, "filhoDono": 0, "virgens": 0, "ovelha": 0 },
    "DIVINOPOLIS": { "biblia": 0, "somos3": 0, "carater": 0, "arrependimento": 0, "avivamento": 0, "filhoDono": 0, "virgens": 0, "ovelha": 0 },
    "ELDORADO": { "biblia": 19, "somos3": 1, "carater": 0, "arrependimento": 0, "avivamento": 0, "filhoDono": 2, "virgens": 0, "ovelha": 0 },
    "GOVERNADOR VALADARES": { "biblia": 27, "somos3": 6, "carater": 7, "arrependimento": 7, "avivamento": 6, "filhoDono": 7, "virgens": 6, "ovelha": 6 },
    "ITABIRA": { "biblia": 15, "somos3": 0, "carater": 0, "arrependimento": 0, "avivamento": 0, "filhoDono": 0, "virgens": 0, "ovelha": 0 },
    "JUIZ DE FORA": { "biblia": 23, "somos3": 5, "carater": 4, "arrependimento": 4, "avivamento": 3, "filhoDono": 4, "virgens": 7, "ovelha": 5 },
    "MONTES CLAROS": { "biblia": 43, "somos3": 0, "carater": 0, "arrependimento": 0, "avivamento": 0, "filhoDono": 0, "virgens": 0, "ovelha": 0 },
    "SETE LAGOAS": { "biblia": 30, "somos3": 2, "carater": 2, "arrependimento": 2, "avivamento": 2, "filhoDono": 4, "virgens": 3, "ovelha": 2 },
    "TEOFILO OTONI": { "biblia": 36, "somos3": 4, "carater": 4, "arrependimento": 4, "avivamento": 4, "filhoDono": 4, "virgens": 4, "ovelha": 4 },
    "UBÁ": { "biblia": 15, "somos3": 0, "carater": 0, "arrependimento": 0, "avivamento": 0, "filhoDono": 0, "virgens": 0, "ovelha": 0 },
    "UBERABA": { "biblia": 7, "somos3": 2, "carater": 7, "arrependimento": 2, "avivamento": 2, "filhoDono": 2, "virgens": 2, "ovelha": 2 },
    "UBERLANDIA": { "biblia": 144, "somos3": 17, "carater": 24, "arrependimento": 20, "avivamento": 18, "filhoDono": 19, "virgens": 21, "ovelha": 21 },
    "VARGINHA": { "biblia": 42, "somos3": 40, "carater": 52, "arrependimento": 40, "avivamento": 45, "filhoDono": 41, "virgens": 43, "ovelha": 44 },
    "VENDA NOVA": { "biblia": 67, "somos3": 46, "carater": 43, "arrependimento": 35, "avivamento": 36, "filhoDono": 44, "virgens": 43, "ovelha": 42 }
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
    atualizarBlocosPendentes();
    renderizarProgresso();
}, (error) => {
    console.error("Erro ao ler o banco:", error);
    corpoTabela.innerHTML = '<tr><td colspan="6" style="text-align:center; color:red;">Erro de permissão no Firebase ou aguardando conexão...</td></tr>';
});

window.excluirRegistro = async (id) => {
    if (confirm("Tem certeza que deseja excluir este registro? Essa ação não pode ser desfeita.")) {
        try {
            await deleteDoc(doc(db, "distribuicoes", id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir o registro.");
        }
    }
};

function atualizarBlocosPendentes() {
    const boxPendentes = document.getElementById('box-pendentes');
    const spanPendentes = document.getElementById('lista-pendentes');
    
    const blocosComRegistro = [...new Set(registrosGlobais.map(r => r.bloco))];
    const blocosPendentes = todosOsBlocos.filter(b => !blocosComRegistro.includes(b));
    
    if (blocosPendentes.length === 0) {
        boxPendentes.style.display = 'none';
    } else {
        boxPendentes.style.display = 'block';
        spanPendentes.textContent = blocosPendentes.join(' | ');
    }
}

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
        corpoTabela.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum registo encontrado no banco.</td></tr>';
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
                <td>
                    <button onclick="excluirRegistro('${reg.id}')" style="background-color: #dc3545; padding: 5px 10px; font-size: 0.8em; text-transform: none; width: auto;">Excluir</button>
                </td>
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

function renderizarProgresso() {
    const container = document.getElementById('corpo-tabela-progresso');
    container.innerHTML = '';

    const progressoBlocos = todosOsBlocos.map(bloco => {
        const limites = limitesBlocos[bloco];
        if (!limites) return null;

        const limiteTotal = Object.values(limites).reduce((a, b) => a + b, 0);

        const registrosDoBloco = registrosGlobais.filter(r => r.bloco === bloco);
        let designadoTotal = 0;
        registrosDoBloco.forEach(reg => {
            designadoTotal += Object.values(reg.livros).reduce((a, b) => a + b, 0);
        });

        const pendente = limiteTotal - designadoTotal;
        const porcentagem = limiteTotal === 0 ? 100 : Math.min(100, Math.round((designadoTotal / limiteTotal) * 100));

        let detalhesFalta = [];
        for (const chave in limites) {
            let gastoLivro = 0;
            registrosDoBloco.forEach(reg => {
                gastoLivro += (reg.livros[chave] || 0);
            });
            const faltaLivro = limites[chave] - gastoLivro;
            if (faltaLivro > 0) {
                detalhesFalta.push(`<strong>${nomesLivrosAdmin[chave]}:</strong> ${faltaLivro}`);
            }
        }
        const stringDetalhes = detalhesFalta.length > 0 ? detalhesFalta.join(' | ') : '<span style="color:#28a745;">Tudo designado</span>';

        return { bloco, limiteTotal, designadoTotal, pendente, porcentagem, stringDetalhes };
    }).filter(b => b !== null);

    progressoBlocos.sort((a, b) => a.porcentagem - b.porcentagem);

    let totalGeral = 0;
    let pendenteGeral = 0;

    progressoBlocos.forEach(pb => {
        totalGeral += pb.limiteTotal;
        pendenteGeral += pb.pendente;

        let corStatus = '#28a745';
        if (pb.porcentagem < 100) corStatus = '#ffc107'; 
        if (pb.porcentagem === 0) corStatus = '#dc3545';

        container.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: #0a162d;">${pb.bloco}</td>
                <td>${pb.limiteTotal}</td>
                <td>${pb.designadoTotal}</td>
                <td style="color: ${pb.pendente > 0 ? '#dc3545' : '#28a745'}; font-weight: bold;">${pb.pendente}</td>
                <td style="font-size: 0.85em;">${pb.stringDetalhes}</td>
                <td style="min-width: 150px;">
                    <div style="background-color: #e9ecef; border-radius: 4px; width: 100%; height: 12px; margin-bottom: 5px; overflow: hidden;">
                        <div style="background-color: ${corStatus}; width: ${pb.porcentagem}%; height: 100%; border-radius: 4px;"></div>
                    </div>
                    <span style="font-size: 0.85em; font-weight: bold; color: ${corStatus};">${pb.porcentagem}% Concluído</span>
                </td>
            </tr>
        `;
    });

    const boxPendentes = document.getElementById('box-pendentes');
    const taxaGlobal = totalGeral > 0 ? Math.round(((totalGeral - pendenteGeral) / totalGeral) * 100) : 100;
    boxPendentes.querySelector('strong').textContent = `Blocos Pendentes (${taxaGlobal}% Global):`;
}
