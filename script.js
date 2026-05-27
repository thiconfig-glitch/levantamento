// 1. BASE DE DADOS
const hierarquiaIgrejas = {
    "VENDA NOVA": {
        "CEU AZUL": ["CEU AZUL", "SANTA MONICA"],
        "ESPERANCA": ["ESPERANCA", "JARDIM SAO JUDAS", "JUSTINOPOLIS"],
        "FORTALEZA": ["FORTALEZA", "LAGOA", "NOVA PAMPULHA"],
        "LAGOA SANTA": ["LAGOA SANTA", "SERRA DO CIPO", "VILA MARIA"],
        "MANTIQUEIRA": ["AREIAS", "MANTIQUEIRA", "MARIA HELENA"],
        "PARAUNA": ["LETICIA", "PARAUNA", "RIO BRANCO"],
        "RIBEIRAO DAS NEVES": ["RIBEIRAO DAS NEVES", "ROSANEVES", "SAN MARINO", "SANTINHO"],
        "SANTA LUZIA BH": ["BOM DESTINO", "DUQUESA", "FRIMISA", "JABOTICATUBAS", "PALMITAL", "PINHAO", "SANTA LUZIA", "SAO BENEDITO", "TAQUARACU"],
        "SAO BERNARDO": ["FLORAMAR", "GUARANI", "SAO BERNARDO", "TUPI"],
        "VENDA NOVA": ["CANAAN", "PEDRA BRANCA", "SERRA VERDE", "VENDA NOVA", "VILA SAO JOAO BATISTA"],
        "VESPASIANO": ["GAVEA", "MORRO ALTO", "SAO JOSE DA LAPA", "VESPASIANO"]
    },
    "MONTES CLAROS": {
        "CENTRO": ["CATEDRAL MONTES CLAROS", "MARACANÃ"],
        "SUL": ["MAJOR PRATES", "VILA EXPOSIÇÃO"]
    }
};

const limitesBlocos = {
    "VENDA NOVA": { biblia: 67, somos3: 46, carater: 43, arrependimento: 35, avivamento: 36, filhoDono: 44, virgens: 43, ovelha: 42 },
    "MONTES CLAROS": { biblia: 43, somos3: 0, carater: 0, arrependimento: 0, avivamento: 0, filhoDono: 0, virgens: 0, ovelha: 0 }
};

const dicionarioAcessos = {
    "VENDANOVA": "VENDA NOVA",
    "MONTESCLAROS": "MONTES CLAROS"
};

const nomesLivros = {
    'biblia': 'Bíblia', 'somos3': 'Somos 3', 'carater': 'Caráter',
    'arrependimento': 'Arrepend.', 'avivamento': 'Avivam.',
    'filhoDono': 'Filho Dono', 'virgens': '10 Virgens', 'ovelha': 'Ovelha'
};

// ==========================================
// ÁREA RESERVADA PARA O FIREBASE
// ==========================================

// 2. ESTADO DA APLICAÇÃO
let blocoAtivo = null;
let saldosAtuais = {};
let registrosDesignados = []; 
let editandoIndex = -1; 

const mapeamentoCampos = {
    'biblia': 'saldo-biblia', 'somos3': 'saldo-somos3', 'carater': 'saldo-carater',
    'arrependimento': 'saldo-arrependimento', 'avivamento': 'saldo-avivamento',
    'filho-dono': 'saldo-filho-dono', 'virgens': 'saldo-virgens', 'ovelha': 'saldo-ovelha'
};

// 3. FLUXO DE LOGIN
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
        alert("Acesso não reconhecido.");
    }
});

// 4. SELETORES
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

// 5. CÁLCULO EM TEMPO REAL E TRAVAS
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

// 6. PROCESSAMENTO DE ENVIO PRINCIPAL
document.getElementById('form-livros').addEventListener('submit', (e) => {
    e.preventDefault();
    const valoresEnviados = {};
    let totalLivros = 0;

    for (const idInput of Object.keys(mapeamentoCampos)) {
        const chaveObjeto = idInput === 'filho-dono' ? 'filhoDono' : idInput;
        const qtd = parseInt(document.getElementById(idInput).value) || 0;
        valoresEnviados[chaveObjeto] = qtd;
        totalLivros += qtd;
    }

    if (totalLivros === 0) {
        alert("Necessitas de designar pelo menos 1 livro antes de enviar.");
        return;
    }

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
});

// 7. MOTOR DO PAINEL E EDIÇÃO DIRETA
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
                        <button type="button" class="btn-salvar" onclick="salvarEdicao(${index})">Salvar</button>
                        <button type="button" class="btn-cancelar" onclick="cancelarEdicao()">Cancelar</button>
                    </div>
                </div>
                <div class="edit-grid">${inputsHTML}</div>
            </div>`;
        } else {
            const itens = Object.entries(reg.livros)
                .filter(([_, qtd]) => qtd > 0)
                .map(([chave, qtd]) => `<strong>${nomesLivros[chave]}:</strong> ${qtd}`)
                .join(', ');

            lista.innerHTML += `
            <div class="registro-item">
                <div class="registro-header">
                    <div><strong>Região:</strong> ${reg.regiao} | <strong>Cenáculo:</strong> ${reg.igreja}</div>
                    <button type="button" class="btn-editar" onclick="ativarEdicao(${index})">Editar</button>
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
                alert(`Erro: A quantidade de "${nomesLivros[chave]}" não pode ultrapassar ${limiteMaximo}.`);
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
