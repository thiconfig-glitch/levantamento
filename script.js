import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// ==========================================
// 1. BASE DE DADOS NACIONAL / ESTADUAL
// ==========================================
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
        "JANAUBA": ["ESPINOSA", "JAIBA", "JANAUBA", "MONTE AZUL NORTE", "PORTEIRINHA"],
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
    }
};

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

const dicionarioAcessos = {
    "VENDANOVA": "VENDA NOVA",
    "MONTESCLAROS": "MONTES CLAROS",
    "VARGINHA": "VARGINHA",
    "UBERLANDIA": "UBERLANDIA",
    "UBERABA": "UBERABA",
    "UBA": "UBÁ",
    "TEOFILOOTONI": "TEOFILO OTONI",
    "SETELAGOAS": "SETE LAGOAS",
    "ITABIRA": "ITABIRA",
    "GOVERNADORVALADARES": "GOVERNADOR VALADARES",
    "JUIZDEFORA": "JUIZ DE FORA",
    "ELDORADO": "ELDORADO",
    "DIVINOPOLIS": "DIVINOPOLIS",
    "CONSELHEIROLAFAIETE": "CONSELHEIRO LAFAIETE",
    "BETIM": "BETIM",
    "BELOHORIZONTE": "BELO HORIZONTE",
    "CATEDRAL": "CATEDRAL"
};

const nomesLivros = {
    'biblia': 'Bíblia', 'somos3': 'Somos 3', 'carater': 'Caráter',
    'arrependimento': 'Arrepend.', 'avivamento': 'Avivam.',
    'filhoDono': 'Filho Dono', 'virgens': '10 Virgens', 'ovelha': 'Ovelha'
};

let blocoAtivo = null;
let saldosAtuais = {};
let registrosDesignados = []; 
let editandoIndex = -1; 

const mapeamentoCampos = {
    'biblia': 'saldo-biblia', 'somos3': 'saldo-somos3', 'carater': 'saldo-carater',
    'arrependimento': 'saldo-arrependimento', 'avivamento': 'saldo-avivamento',
    'filho-dono': 'saldo-filho-dono', 'virgens': 'saldo-virgens', 'ovelha': 'saldo-ovelha'
};

document.getElementById('btn-entrar').addEventListener('click', (e) => {
    e.preventDefault();
    const acessoBruto = document.getElementById('email-login').value.replace(/\s+/g, '').toUpperCase();
    blocoAtivo = dicionarioAcessos[acessoBruto];

    if (blocoAtivo && hierarquiaIgrejas[blocoAtivo]) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('form-section').style.display = 'block';
        document.getElementById('titulo-modal').textContent = `Livros Designados (${blocoAtivo})`;

        carregarRegioes(blocoAtivo);
        saldosAtuais = { ...limitesBlocos[blocoAtivo] }; 
        aplicarTravasIniciais();
    } else {
        alert("Acesso não reconhecido ou bloco sem igrejas configuradas.");
    }
});

const seletorRegiao = document.getElementById('seletor-regiao');
const seletorIgreja = document.getElementById('seletor-igreja');

function carregarRegioes(bloco) {
    seletorRegiao.innerHTML = '<option value="">Selecione a Região...</option>';
    seletorRegiao.disabled = false;
    Object.keys(hierarquiaIgrejas[bloco]).forEach(regiao => seletorRegiao.add(new Option(regiao, regiao)));
}

seletorRegiao.addEventListener('change', (e) => {
    seletorIgreja.innerHTML = '<option value="">Selecione o Cenáculo...</option>';
    if (e.target.value) {
        seletorIgreja.disabled = false;
        hierarquiaIgrejas[blocoAtivo][e.target.value].forEach(igreja => seletorIgreja.add(new Option(igreja, igreja)));
    } else {
        seletorIgreja.disabled = true;
    }
});

function aplicarTravasIniciais() {
    for (const [idInput, idSpan] of Object.entries(mapeamentoCampos)) {
        const chaveObjeto = idInput === 'filho-dono' ? 'filhoDono' : idInput;
        const saldo = saldosAtuais[chaveObjeto];
        const inputElement = document.getElementById(idInput);
        
        document.getElementById(idSpan).textContent = `(Restam: ${saldo})`;
        inputElement.max = saldo;
        inputElement.value = 0; 
        inputElement.disabled = (saldo === 0);

        const novoElemento = inputElement.cloneNode(true);
        inputElement.parentNode.replaceChild(novoElemento, inputElement);
        
        novoElemento.addEventListener('input', (e) => {
            let digitado = parseInt(e.target.value) || 0;
            if (digitado > saldosAtuais[chaveObjeto]) {
                digitado = saldosAtuais[chaveObjeto];
                e.target.value = digitado;
            }
            if (digitado < 0) {
                digitado = 0;
                e.target.value = 0;
            }
            const novoResto = saldosAtuais[chaveObjeto] - digitado;
            document.getElementById(idSpan).textContent = `(Restam: ${novoResto})`;
        });
    }
}

document.getElementById('form-livros').addEventListener('submit', async (e) => {
    e.preventDefault();
    const valoresEnviados = {};
    let totalLivros = 0;
    const btnSubmit = document.querySelector('button[type="submit"]');
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = "A gravar...";

    for (const idInput of Object.keys(mapeamentoCampos)) {
        const chaveObjeto = idInput === 'filho-dono' ? 'filhoDono' : idInput;
        const qtd = parseInt(document.getElementById(idInput).value) || 0;
        valoresEnviados[chaveObjeto] = qtd;
        totalLivros += qtd;
    }

    if (totalLivros === 0) {
        alert("Necessitas de designar pelo menos 1 livro antes de enviar.");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Designar Quantidades";
        return;
    }

    try {
        await addDoc(collection(db, "distribuicoes"), {
            bloco: blocoAtivo,
            regiao: seletorRegiao.value,
            igreja: seletorIgreja.value,
            livros: valoresEnviados,
            timestamp: serverTimestamp()
        });

        registrosDesignados.push({
            regiao: seletorRegiao.value, 
            igreja: seletorIgreja.value, 
            livros: valoresEnviados
        });

        for (const chave in valoresEnviados) saldosAtuais[chave] -= valoresEnviados[chave];

        seletorIgreja.innerHTML = '<option value="">Selecione primeiro a região...</option>';
        seletorIgreja.disabled = true;
        document.getElementById('form-livros').reset();
        aplicarTravasIniciais(); 
    } catch (error) {
        console.error("Erro ao gravar: ", error);
        alert("Falha na comunicação com o servidor.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Designar Quantidades";
    }
});

const modal = document.getElementById('modal-painel');
const btnAbrir = document.getElementById('btn-abrir-painel');
const btnFechar = document.querySelector('.close-btn');

btnAbrir.onclick = () => {
    editandoIndex = -1; 
    renderizarPainel();
    modal.style.display = 'block';
}

function renderizarPainel() {
    const lista = document.getElementById('lista-registros');
    lista.innerHTML = '';

    if (registrosDesignados.length === 0) {
        lista.innerHTML = '<p>Nenhuma quantidade designada nesta sessão.</p>';
        return;
    }

    registrosDesignados.forEach((reg, index) => {
        if (index === editandoIndex) {
            let inputsHTML = '';
            for (const chave in reg.livros) {
                const limiteMaximo = saldosAtuais[chave] + reg.livros[chave];
                if (limiteMaximo > 0) {
                    inputsHTML += `
                    <div class="edit-item">
                        <label title="${nomesLivros[chave]}">${nomesLivros[chave]}</label>
                        <input type="number" id="edit-${chave}" value="${reg.livros[chave]}" min="0" max="${limiteMaximo}">
                    </div>`;
                }
            }

            lista.innerHTML += `
            <div class="registro-item" style="border-left-color: #ffc107;">
                <div class="registro-header">
                    <div><strong>Região:</strong> ${reg.regiao} | <strong>Cenáculo:</strong> ${reg.igreja}</div>
                    <div>
                        <button type="button" class="btn-salvar" onclick="window.salvarEdicao(${index})">Salvar</button>
                        <button type="button" class="btn-cancelar" onclick="window.cancelarEdicao()">Cancelar</button>
                    </div>
                </div>
                <div class="edit-grid">${inputsHTML}</div>
            </div>`;
        } else {
            const itens = Object.entries(reg.livros)
                .filter(([_, qtd]) => qtd > 0)
                .map(([chave, qtd]) => `<strong>${nomesLivros[chave]}:</strong> ${qtd}`).join(', ');

            lista.innerHTML += `
            <div class="registro-item">
                <div class="registro-header">
                    <div><strong>Região:</strong> ${reg.regiao} | <strong>Cenáculo:</strong> ${reg.igreja}</div>
                    <button type="button" class="btn-editar" onclick="window.ativarEdicao(${index})">Editar</button>
                </div>
                <div style="font-size: 0.95em;">${itens || 'Nenhum livro designado.'}</div>
            </div>`;
        }
    });
}

window.ativarEdicao = (index) => {
    editandoIndex = index;
    renderizarPainel();
};

window.cancelarEdicao = () => {
    editandoIndex = -1;
    renderizarPainel();
};

window.salvarEdicao = (index) => {
    const reg = registrosDesignados[index];
    const novosValores = {};
    let erroMatematico = false;

    for (const chave in reg.livros) {
        const limiteMaximo = saldosAtuais[chave] + reg.livros[chave];
        if (limiteMaximo > 0) {
            const inputElem = document.getElementById(`edit-${chave}`);
            let novoQtd = parseInt(inputElem.value) || 0;
            if (novoQtd < 0) novoQtd = 0;
            
            if (novoQtd > limiteMaximo) {
                alert(`Erro: A quantidade ultrapassa o limite de ${limiteMaximo}.`);
                erroMatematico = true;
                break;
            }
            novosValores[chave] = novoQtd;
        } else {
            novosValores[chave] = 0;
        }
    }

    if (erroMatematico) return;

    for (const chave in novosValores) {
        const delta = novosValores[chave] - reg.livros[chave];
        saldosAtuais[chave] -= delta; 
        reg.livros[chave] = novosValores[chave];
    }

    editandoIndex = -1;
    renderizarPainel();
    aplicarTravasIniciais(); 
};

btnFechar.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; }
