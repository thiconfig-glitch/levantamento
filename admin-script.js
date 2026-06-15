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

const hierarquiaIgrejas = {
    "VENDA NOVA": {
        "CEU AZUL": ["CEU AZUL", "SANTA MONICA"],
        "ESPERANCA": ["ESPERANCA", "JARDIM SAO JUDAS", "JUSTINOPOLIS"],
        "FORTALEZA": ["FORTALEZA", "LAGOA", "NOVA PAMPULHA"],
        "LAGOA SANTA": ["LAGOA SANTA", "SERRA DO CIPO", "VILA MARIA"],
        "MANTIQUEIRA": ["AREIAS", "MANTIQUEIRA", "MARIA HELENA"],
        "PARAUNA": ["LETICIA", "PARAUNA", "RIO BRANCO"],
        "RIBEIRAO DAS NEVES": ["RIBEIRAO DAS NEVES", "ROSANEVES", "SAN MARINO", "SANTINHO"],
        "SANTA LUZIA BH": ["BOM DESTINO", "DUQUESA", "FRIMISA", "JABOTICATUBAS", "MONTE AZUL", "SANTA LUZIA BH", "TAQUARACU", "VILA OLGA"],
        "SAO BENEDITO": ["CRISTINA", "JOSE PEREGRINO", "JULIANA", "LONDRINA", "PALMITAL", "SAO BENEDITO", "SAO COSME"],
        "VENDA NOVA": ["COMERCIARIOS", "FLORAMAR", "SAO JOAO BATISTA", "SERRA VERDE", "VENDA NOVA"],
        "VESPASIANO": ["DOM PEDRO |", "SAO JOSE DA LAPA", "VESPASIANO"],
        "VILA ESPORTIVA": ["CIDADE ALTA", "MORRO ALTO", "SERRA DOURADA", "VILA ESPORTIVA"]
    },
    "VARGINHA": {
        "ALFENAS": ["ALFENAS", "ALTEROSA", "AREADO", "CAMPO DO MEIO", "CAMPOS GERAIS", "SERRANIA"],
        "ANDRADAS": ["ANDRADAS", "JACUTINGA", "SANTO ANTONIO JARDIM"],
        "EXTREMA": ["CAMANDUCAIA", "CAMBUI", "EXTREMA"],
        "GUAXUPE": ["ARCEBURGO", "CABO VERDE", "GUARANESIA", "GUAXUPE", "MUZAMBINHO"],
        "ITAJUBA": ["ITAJUBA", "MARIA DA FE", "PARAISOPOLIS", "PEDRALVA", "SANTA RITA DO SAPUCAI"],
        "LAVRAS": ["BOM SUCESSO", "IJACI", "LAVRAS", "NEPOMUCENO", "PERDOES", "SANTO ANTONIO DO AMPARO"],
        "PASSOS": ["ALPINOPOLIS", "CARMO DO RIO CLARO", "CASSIA", "ITAU DE MINAS", "PASSOS"],
        "POCOS DE CALDAS": ["BOTELHOS", "CALDAS", "CAMPESTRE", "CONJUNTO HABITACIONAL", "POCOS DE CALDAS"],
        "POUSO ALEGRE": ["BORDA DA MATA", "CAREACU", "IPUIUNA", "MONTE SIAO", "OURO FINO", "POUSO ALEGRE", "SAO GONCALO"],
        "SAO LOURENCO": ["ANDRELANDIA", "BAEPENDI", "CAXAMBU", "CONCEICAO DO RIO VERDE", "CRUZILIA", "ITANHANDU", "LAMBARI", "SAO LOURENCO", "SAO VICENTE DE MINAS"],
        "SAO SEBASTIAO DO PARAISO": ["CAPETINGA", "ITAMOGI", "MONTE SANTO DE MINAS", "SAO SEBASTIAO DO PARAISO"],
        "TRES CORACOES": ["CAMBUQUIRA", "CAMPANHA", "CARMO DA CACHOEIRA", "MONSENHOR PAULO", "SAO THOME DAS LETRAS", "TRES CORACOES"],
        "TRES PONTAS": ["BOA ESPERANCA", "COQUEIRAL", "ILICINEA", "SANTANA DA VARGEM", "TRES PONTAS"],
        "VARGINHA": ["ELOI MENDES", "MACHADO", "PARAGUACU", "POCO FUNDO", "SION", "VARGINHA"]
    },
    "UBERLANDIA": {
        "ARAGUARI": ["AEROPORTO SUL", "ARAGUARI", "INDEPENDENCIA ARAGUARI"],
        "BURITIS": ["BURITIS", "INDIANOPOLIS", "IPANEMA BURITIS", "MORUMBI", "SHOPPING PARK"],
        "ITUIUTABA": ["BAIRRO NATAL", "CANAPOLIS", "CAPINOPOLIS", "ITUIUTABA", "SANTA VITORIA"],
        "JOAO PINHEIRO": ["JOAO PINHEIRO", "LAGOA GRANDE"],
        "LUIZOTE": ["CANAA LUIZOTE", "JARDIM BRASILIA", "LUIZOTE", "MONTE ALEGRE", "TOCANTINS", "ZULMIRA"],
        "PARACATU": ["GUARDA MOR", "LAGAMAR", "PARACATU", "PARACATUZINHO", "VAZANTE"],
        "PATOS DE MINAS": ["CARMO DO PARANAIBA", "LAGOA FORMOSA", "NOVA FLORESTA", "PATOS DE MINAS", "PRESIDENTE OLEGARIO"],
        "PATROCINIO": ["COROMANDEL", "MONTE CARMELO", "PATROCINIO", "SERRA DO SALITRE", "SERRA NEGRA"],
        "PLANALTO": ["JARDIM CELIA", "NOVA PONTE", "PLANALTO", "PRATA", "SANTA JULIANA", "TUPACIGUARA"],
        "UBERLANDIA": ["ACLIMACAO", "DOM ALMIR", "MARTA HELENA", "ROOSEVELT", "SALOMAO", "UBERLANDIA"],
        "UNAI": ["ARINOS", "BURITIS UNAI", "UNAI", "URUCUIA"]
    },
    "UBERABA": {
        "ARAXA": ["ALMEIDA CAMPOS", "ARAXA", "IBIA", "PERDIZES", "URCIANO LEMOS"],
        "FRUTAL": ["FRONTEIRA", "FRUTAL", "ITAPAGIPE", "PLANURA"],
        "ITURAMA": ["CAMPINA VERDE", "FRANCISCO SALES", "ITURAMA"],
        "PACAEMBU": ["CAMPO FLORIDO", "PACAEMBU", "SACRAMENTO", "VERISSIMO"],
        "SAO GOTARDO": ["CAMPOS ALTOS", "RIO PARANAIBA", "SAO GOTARDO"],
        "UBERABA": ["ABADIA", "CIDADE NOVA", "CONCEICAO DE ALAGOAS", "GAMELEIRA", "LEBLON", "MERCES", "MORADA DO SOL", "PARQUE DAS AMERICAS", "RESIDENCIAL 2000", "UBERABA", "VALIM DE MELO"]
    },
    "UBÁ": {
        "ALEM PARAIBA": ["ALEM PARAIBA", "VOLTA GRANDE"],
        "CATAGUASES": ["CATAGUASES", "LEOPOLDINA", "MIRAI", "RECREIO"],
        "MURIAE": ["EUGENOPOLIS", "MIRADOURO", "MURIAE", "PATROCINIO DO MURIAE"],
        "PONTE NOVA": ["ABRE CAMPO", "AMPARO DO SERRA", "GUARACIABA", "ORATORIOS", "PADRE FELISBERTO", "PIEDADE", "PONTE NOVA", "PONTE NOVA DOIS", "RAUL SOARES", "RIO CASCA", "SANTO ANTONIO DO GRAMA", "URUCANIA", "VAU ACU"],
        "UBA": ["ASTOLFO DUTRA", "CARANGOLA", "DIVINO", "ESPERA FELIZ", "GUARANI UBA", "GUIDOVAL", "PIRAUBA", "RIO POMBA", "RODEIRO", "SAO LUIZ", "TOMBOS", "UBA"],
        "VICOSA": ["ERVALIA", "NOVA VICOSA", "PORTO FIRME", "SAO MIGUEL", "TEIXEIRAS", "VICOSA"],
        "VISCONDE DO RIO BRANCO": ["COIMBRA", "SAO GERALDO", "VISCONDE DO RIO BRANCO"]
    },
    "TEOFILO OTONI": {
        "ALMENARA": ["ALMENARA", "FELISBURGO", "JACINTO", "JEQUITINHONHA", "JOAIMA", "MATA VERDE", "RUBIM"],
        "ARACUAI": ["ARACUAI", "CACHOEIRA DE PAJEU", "CIDADE PEDRA AZUL", "ITAOBIM", "JENIPAPO DE MINAS", "MEDINA", "VIRGEM DA LAPA"],
        "MALACACHETA": ["AGUA BOA", "CAMPOS DE TURMALINA", "CAPELINHA", "FRANCISCOPOLIS", "MALACACHETA", "MINAS NOVAS", "SANTA MARIA DO SUACUI"],
        "NANUQUE": ["CARLOS CHAGAS", "IBIRAPUA", "MONTANHA", "NANUQUE"],
        "TEOFILO OTONI": ["AGUAS FORMOSAS", "ATALEIA", "CAMPANARIO", "CARAI", "FREI GASPAR", "FRONTEIRA DOS VALES", "ITAIPE", "ITAMBACURI", "LADAINHA", "NOVO ORIENTE", "PADRE DO PARAISO", "POTE", "SANTA HELENA", "SARGENTO", "TAQUARA", "TEOFILO OTONI"]
    },
    "SETE LAGOAS": {
        "CURVELO": ["AUGUSTO DE LIMA", "BUENOPOLIS", "CORINTO", "CURVELO", "FELIXLANDIA", "TRES MARIAS"],
        "DIAMANTINA": ["DIAMANTINA", "ITAMARANDIBA"],
        "MATOZINHOS": ["BOM JESUS", "CAPIM BRANCO", "MATOZINHOS"],
        "PEDRO LEOPOLDO": ["CONFINS", "LAGOA DE SANTO ANTONIO", "PEDRO LEOPOLDO"],
        "SETE LAGOAS": ["CACHOEIRA DA PRATA", "CAETANOPOLIS", "CIDADE DE DEUS", "MANOA", "NOVA CIDADE", "PARAOPEBA", "PRUDENTE DE MORAIS", "SETE LAGOAS"]
    },
    "MONTES CLAROS": {
        "JANAUBA": ["ESPINOSA", "JAIBA", "JANAUBA", "MONTE AZUL NORTH", "PORTEIRINHA"],
        "JANUARIA": ["JANUARIA", "LONTRA", "SAO JOAO DA PONTE", "VARZELANDIA"],
        "MARACANA": ["CORAÇAO DE JESUS", "MAJOR PRATES", "MARACANA"],
        "MONTES CLAROS": ["ALTO BOA VISTA", "BOCAIUVA", "CAPITAO ENEAS", "CURRAL DE DENTRO", "ENGENHEIRO NAVARRO", "FRANCISCO SA", "GLAUCILANDIA", "INDEPENDENCIA", "JARDIM PALMEIRA", "MIRABELA", "MONTES CLAROS", "OLHOS DAGUA", "PATIS", "RIO PARDO DE MINAS", "RUBELITA", "SALINAS", "SAO JOAO DO PARAISO", "TAIOBEIRAS"],
        "PIRAPORA": ["BURITIZEIRO", "PIRAPORA", "VARZEA DA PALMA"],
        "SAO FRANCISCO": ["BRASILIA DE MINAS", "SAO FRANCISCO", "SAO ROMAO"]
    },
    "ITABIRA": {
        "BARAO DE COCAIS": ["BARAO DE COCAIS", "SANTA BARBARA"],
        "GUANHAES": ["CONCEICAO DO MATO", "GUANHAES", "MORRO DO PILAR", "PECANHA", "RIO VERMELHO", "SABINOPOLIS", "SAO JOAO EVANGELISTA", "SERRO"],
        "ITABIRA": ["AGUA FRESCA", "BAIRRO MACHADO", "BOM JESUS DO AMPARO", "ITABIRA", "NOVA UNIAO", "PEDREIRA"],
        "JOAO MONLEVADE": ["ALVINOPOLIS", "DIONISIO", "JOAO MONLEVADE", "LAGES", "NOVA ERA", "NOVO CRUZEIRO", "RIO PIRACICABA", "SAO DOMINGOS DO PRATA"]
    },
    "GOVERNADOR VALADARES": {
        "CARATINGA": ["BOM JESUS DO GALHO", "CARATINGA", "VARGEM ALEGRE"],
        "CORONEL FABRICIANO": ["CORONEL FABRICIANO", "GERALDO INACIO", "JAGUARACU", "TIMOTEO"],
        "GOVERNADOR VALADARES": ["CONJUNTO SIR", "CONSELHEIRO PENA", "COROACI", "ENGENHEIRO CALDAS", "FREI INOCENCIO", "GOVERNADOR VALADARES", "ITANHOMI", "JARDIM PEROLA", "MANTENA", "RESPLENDOR", "TURMALINA", "VILA ISA"],
        "IPATINGA": ["BOM JARDIM", "CANAA", "HORTENCIA", "IPABA", "IPATINGA", "NAQUE", "SANTANA DO PARAÍSO"],
        "MANHUACU": ["CIDADE IPANEMA", "MANHUACU", "MANHUMIRIM", "MATIPO", "SAO JOAO DO MANHUACU"]
    },
    "JUIZ DE FORA": {
        "BENFICA": ["BENFICA", "BOM JARDIM DE MINAS", "LIMA DUARTE", "NOVA ERA BENFICA", "SANTA CRUZ"],
        "JOQUEI CLUBE": ["CERAMICA", "JOQUEI CLUBE", "MILHO BRANCO"],
        "JUIZ DE FORA": ["BELMIRO BRAGA", "EWBANK DA CAMARA", "FILGUEIRAS", "GRAMA", "JUIZ DE FORA", "MARIANO PROCOPIO", "PROGRESSO", "RIO NOVO", "SANTO ANTONIO", "SANTOS DUMONT", "SAO MATEUS", "SAO PEDRO", "SIMAO PEREIRA"],
        "SANTA LUZIA JF": ["BICAS", "IPIRANGA", "MAR DE ESPANHA", "MATIAS BARBOSA", "SANTA LUZIA JF", "SAO JOAO NEPOMUCENO"]
    },
    "ELDORADO": {
        "ALVORADA": ["ALVORADA", "BERNARDO MONTEIRO", "FUNCIONARIOS", "PRAIA"],
        "ELDORADO": ["AGUA BRANCA", "ELDORADO", "NOVO RIACHO", "PARQUE SAO JOAO", "RIACHO DAS PEDRAS"],
        "FLORENCA": ["FLORENCA", "MELO VIANA"],
        "INDUSTRIAL": ["INDUSTRIAL", "LINDEIA", "PETROVALE", "TIRADENTES"],
        "LAGUNA": ["GUANABARA", "LAGUNA", "NOVO BOA VISTA"],
        "NOVA CONTAGEM": ["DARCY RIBEIRO", "ICAIVERA", "NOVA CONTAGEM", "NOVO RETIRO"],
        "NOVO PROGRESSO": ["ESTRELA DALVA", "ITATIAIA", "NOVO PROGRESSO"],
        "PETROLANDIA": ["CANADA", "PETROLANDIA", "SAO CAETANO", "TROPICAL"],
        "PINDORAMA": ["COLORADO", "IPANEMA", "MORADA NOVA", "PINDORAMA"],
        "SAO FRANCISCO DAS NEVES": ["ESMERALDAS", "SAO FRANCISCO DAS NEVES"],
        "VENEZA": ["LIBERDADE", "VENEZA"]
    },
    "DIVINOPOLIS": {
        "ABAETE": ["ABAETE", "DORES DO INDAIA", "MARTINHO CAMPOS", "POMPEU"],
        "DIVINOPOLIS": ["CARMO DO CAJURU", "DIVINOPOLIS", "SANTO ANTONIO DO MONTE", "SAO GONCALO DO PARA"],
        "FORMIGA": ["ARCOS", "BAMBUI", "FORMIGA", "LAGOA DA PRATA", "PIUMHI"],
        "ITAUNA": ["ITAGUARA", "ITATIAIUCU", "ITAUNA"],
        "NOVA SERRANA": ["BOM DESPACHO", "LUZ", "NOVA SERRANA", "PERDIGAO"],
        "OLIVEIRA": ["CAMPO BELO", "CANDEIAS", "CARMO DA MATA", "CARMOPOLIS DE MINAS", "CIDADE CLAUDIO", "OLIVEIRA"],
        "PARA DE MINAS": ["PAPAGAIOS", "PARA DE MINAS", "PITANGUI"]
    },
    "CONSELHEIRO LAFAIETE": {
        "BARBACENA": ["BARBACENA", "BARROSO", "SAO JOAO DEL REI", "TIJUCO"],
        "CONSELHEIRO LAFAIETE": ["BELO VALE", "CARANDAI", "CONGONHAS", "CONSELHEIRO LAFAIETE", "CRISTIANO OTONI", "ENTRE RIOS", "JECEABA", "OURO BRANCO", "SAO BRAS DE SUACUI"],
        "MARIANA": ["MARIANA", "MARIANA NOVA", "OURO PRETO"]
    },
    "BETIM": {
        "BETIM": ["BETIM", "LARANJEIRAS", "MARIMBA", "SENHORA DAS GRAÇAS", "VILA CRISTINA"],
        "CITROLANDIA": ["BRUMADINHO", "CITROLANDIA", "COLONIA ISABEL", "MARIO CAMPOS"],
        "IGARAPE": ["BONFIM", "IGARAPE", "RIO MANSO", "SAO JOAQUIM DE BICAS"],
        "JARDIM ALTEROSA": ["JARDIM ALTEROSA", "NITEROI"],
        "JARDIM TERESOPOLIS": ["JARDIM TERESOPOLIS", "NOVA CAPELINHA", "NOVO AMAZONAS"],
        "MATEUS LEME": ["FLORESTAL", "JUATUBA", "MATEUS LEME"],
        "PTB": ["CRUZEIRO", "GRANJA SAO JOAO", "PTB"],
        "SARZEDO": ["BANDEIRINHAS", "MONTREAL", "SARZEDO", "TANGARA"]
    },
    "BELO HORIZONTE": {
        "AMAZONAS": ["AMAZONAS", "BETANIA", "CAMARGOS", "NOVA CINTRA", "PALMEIRAS 1"],
        "BARREIRO": ["BAIRRO DAS INDUSTRIAS", "BARREIRO", "CARDOSO", "MILIONARIOS"],
        "BARROCA": ["ALTO DOS PINHEIROS", "BARROCA", "JARDIM AMERICA", "SALGADO FILHO"],
        "CAETES": ["CAETES", "NOVA VISTA", "NOVO OURO PRETO"],
        "CRISTIANO MACHADO": ["CAPITAO EDUARDO", "CRISTIANO MACHADO", "EYMARD", "JACUI", "JARAGUA", "SANTA CRUZ CRISTIANO MACHADO"],
        "GOIANIA": ["GOIANIA", "JARDIM VITORIA", "SANTA INES", "SENHORA DE FATIMA"],
        "GUARANI": ["GUARANI", "JARDIM GUANABARA", "PRIMEIRO DE MAIO", "PROVIDENCIA", "SAO BERNARDO", "TUPI"],
        "IBIRITE": ["IBIRITE", "JACANA", "JARDIM DAS ROSAS", "MORADA DA SERRA"],
        "ITABIRITO": ["AMARANTINA", "CACHOEIRA DO CAMPO", "ITABIRITO"],
        "JATOBA": ["BANDEIRANTES", "DURVAL DE BARROS", "JATOBA", "TIROL"],
        "NOVA LIMA": ["CABECEIRA", "NOVA LIMA", "RAPOSOS", "RIO ACIMA"],
        "PADRE EUSTAQUIO": ["JARDIM ALVORADA PAZ", "PADRE EUSTAQUIO", "SANTA TEREZINHA"],
        "PEDRA AZUL": ["JARDIM ALVORADA", "NACIONAL", "PEDRA AZUL"],
        "RIO DE JANEIRO": ["BOA VISTA", "HORTO", "POMPEIA", "RIO DE JANEIRO"],
        "SABARA": ["BORBA GATO", "CIDADE CAETE", "GENERAL CARNEIRO", "RAVENA", "SABARA"],
        "SAO CRISTOVAO": ["APARECIDA", "NOVA CACHOEIRINHA", "SAO CRISTOVAO"],
        "SAO GABRIEL": ["NAZARE", "RIBEIRO DE ABREU", "SAO GABRIEL"],
        "SÃO GABRIEL": ["PAULO SEXTO"],
        "SAVASSI": ["ALTO VERA CRUZ", "CASTANHEIRAS", "JARDIM CANADA", "PILAR", "RAJA", "SANTA EFIGENIA", "SAVASSI", "SERRA", "TAQUARIL"],
        "VALE DO JATOBA": ["ANTIGO MINEIRAO", "MARILANDIA", "OLARIA", "VALE DO JATOBA", "VILA PINHO"]
    },
    "CATEDRAL": {
        "CATEDRAL": ["CATEDRAL"]
    }
};

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
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        // Filtro de "Reset": Só aceita registros que tenham o novo campo de redução
        if (data.reducaoLanchinhos !== undefined) {
            registrosGlobais.push({
                id: docSnap.id,
                timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
                bloco: data.bloco,
                regiao: data.regiao,
                igreja: data.igreja,
                reducaoLanchinhos: data.reducaoLanchinhos
            });
        }
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
        const hierarquia = hierarquiaIgrejas[bloco];
        let totalIgrejas = 0;
        if (hierarquia) {
            Object.values(hierarquia).forEach(cenaculos => {
                totalIgrejas += cenaculos.length;
            });
        }

        const registrosDoBloco = registrosGlobais.filter(r => r.bloco === bloco);
        const igrejasRespondidas = new Set(registrosDoBloco.map(r => r.igreja)).size;
        
        const porcentagem = totalIgrejas === 0 ? 100 : Math.round((igrejasRespondidas / totalIgrejas) * 100);
        const status = `${igrejasRespondidas} / ${totalIgrejas} Igrejas`;

        return { bloco, status, porcentagem, totalIgrejas, igrejasRespondidas };
    });

    progressoBlocos.sort((a, b) => a.porcentagem - b.porcentagem);

    progressoBlocos.forEach(pb => {
        let corStatus = '#28a745';
        if (pb.porcentagem < 100) corStatus = '#ffc107'; 
        if (pb.porcentagem === 0) corStatus = '#dc3545';

        container.innerHTML += `
            <tr>
                <td style="font-weight: bold; color: #0a162d;">${pb.bloco}</td>
                <td style="color: ${corStatus}; font-weight: bold;">${pb.status}</td>
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
    const blocosConcluidos = progressoBlocos.filter(pb => pb.porcentagem === 100).length;
    const blocosPendentesNomes = progressoBlocos.filter(pb => pb.porcentagem < 100).map(pb => pb.bloco);
    const taxaGlobal = Math.round((blocosConcluidos / todosOsBlocos.length) * 100);
    
    boxPendentes.querySelector('strong').textContent = `Status Global (${taxaGlobal}% Blocos 100%):`;
    const spanPendentes = document.getElementById('lista-pendentes');
    
    if (blocosPendentesNomes.length === 0) {
        spanPendentes.textContent = "Todos os blocos concluíram o levantamento!";
        boxPendentes.style.backgroundColor = "#d4edda";
        boxPendentes.style.borderColor = "#c3e6cb";
        boxPendentes.style.color = "#155724";
    } else {
        spanPendentes.textContent = "Aguardando conclusão: " + blocosPendentesNomes.join(' | ');
        boxPendentes.style.backgroundColor = "#fff3cd";
        boxPendentes.style.borderColor = "#ffc107";
        boxPendentes.style.color = "#856404";
    }
}

