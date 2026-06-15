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

const todosOsBlocos = [
    "BELO HORIZONTE", "BETIM", "CATEDRAL", "CONSELHEIRO LAFAIETE", "DIVINOPOLIS",
    "ELDORADO", "GOVERNADOR VALADARES", "ITABIRA", "JUIZ DE FORA", "MONTES CLAROS",
    "SETE LAGOAS", "TEOFILO OTONI", "UBÁ", "UBERABA", "UBERLANDIA", "VARGINHA", "VENDA NOVA"
];

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
            reducaoLanchinhos: data.reducaoLanchinhos || 0
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

        corpoTabela.innerHTML += `
            <tr>
                <td>${dataFormatada}</td>
                <td style="font-weight: bold; color: #0a162d;">${reg.bloco}</td>
                <td>${reg.regiao}</td>
                <td>${reg.igreja}</td>
                <td style="font-weight: bold; color: #dc3545;">${reg.reducaoLanchinhos}</td>
                <td>
                    <button onclick="excluirRegistro('${reg.id}')" style="background-color: #dc3545; padding: 5px 10px; font-size: 0.8em; text-transform: none; width: auto;">Excluir</button>
                </td>
            </tr>`;
    });
}

function calcularKPIs(dados) {
    document.getElementById('kpi-total').textContent = dados.length;

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
    
    let dadosParaExportar = [...registrosGlobais];
    
    if (blocoSelecionado !== "TODOS") {
        dadosParaExportar = dadosParaExportar.filter(r => r.bloco === blocoSelecionado);
    }

    if (dadosParaExportar.length === 0) {
        alert("Não há dados para exportar.");
        return;
    }

    dadosParaExportar.sort((a, b) => a.bloco.localeCompare(b.bloco));

    let csvContent = `RELATORIO DE REDUCAO DE LANCHINHOS\n`;
    csvContent += `Data;Bloco;Regiao;Cenaculo;Reducao\n`;

    dadosParaExportar.forEach(reg => {
        const dataFormatada = reg.timestamp.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).replace(',', '');
        csvContent += `${dataFormatada};${reg.bloco};${reg.regiao};${reg.igreja};${reg.reducaoLanchinhos}\n`;
    });

    const bom = "\uFEFF";
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const dataIso = new Date().toISOString().slice(0,10);
    a.download = `relatorio_${blocoSelecionado.toLowerCase().replace(/ /g, '_')}_${dataIso}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

function renderizarProgresso() {
    const container = document.getElementById('corpo-tabela-progresso');
    container.innerHTML = '';

    const progressoBlocos = todosOsBlocos.map(bloco => {
        const registrosDoBloco = registrosGlobais.filter(r => r.bloco === bloco);
        const status = registrosDoBloco.length > 0 ? "Enviado" : "Pendente";
        const porcentagem = registrosDoBloco.length > 0 ? 100 : 0;

        return { bloco, status, porcentagem };
    });

    progressoBlocos.sort((a, b) => a.porcentagem - b.porcentagem);

    progressoBlocos.forEach(pb => {
        let corStatus = pb.porcentagem === 100 ? '#28a745' : '#dc3545';

        container.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: #0a162d;">${pb.bloco}</td>
                <td style="color: ${corStatus}; font-weight: bold;">${pb.status}</td>
                <td style="min-width: 150px;">
                    <div style="background-color: #e9ecef; border-radius: 4px; width: 100%; height: 12px; margin-bottom: 5px; overflow: hidden;">
                        <div style="background-color: ${corStatus}; width: ${pb.porcentagem}%; height: 100%; border-radius: 4px;"></div>
                    </div>
                    <span style="font-size: 0.85em; font-weight: bold; color: ${corStatus};">${pb.porcentagem}%</span>
                </td>
            </tr>
        `;
    });

    const boxPendentes = document.getElementById('box-pendentes');
    const blocosEnviados = progressoBlocos.filter(pb => pb.porcentagem === 100).length;
    const taxaGlobal = Math.round((blocosEnviados / todosOsBlocos.length) * 100);
    boxPendentes.querySelector('strong').textContent = `Blocos Pendentes (${taxaGlobal}% Global):`;
}

