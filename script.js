let servicos = [
    {
        id: 1,
        nome: "Gestão de e-mails",
        valor: 40,
        horas: 6,
        unidade: 'hora'
    },

    {
        id: 2,
        nome: "Agenda e agendamentos",
        valor: 40,
        horas: 4,
        unidade: 'hora'
    },

    {
        id: 3,
        nome: "Conciliação financeira",
        valor: 55,
        horas: 8,
        unidade: 'hora'
    }
];

const servicosLista = document.querySelector('#servicos-lista');
const reciboLista = document.querySelector('#recibo-lista');
const subtotalValor = document.getElementById('subtotal-valor');
const totalValor = document.getElementById('total-valor');
const modalServico = document.getElementById('modal-servico');
const adicionarBtn = document.getElementById('adicionar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const formServico = document.getElementById('form-servico');
const campoNome = document.getElementById('novo-nome');
const campoValor = document.getElementById('novo-valor');
const mensagemErro = document.getElementById('erro-servico');
const opcoesCobranca = document.getElementById('opcoes-cobranca');
const urgenteBtn = document.getElementById('urgente-btn');

let cobrado = 'hora';

servicosLista.addEventListener('click', (evento) => {
    const id = Number(evento.target.dataset.id);

    const servico = servicos.find((item) => {
        return item.id === id;
    });

    if (!servico) {
        return;
    }

    if (evento.target.classList.contains('mais-btn')) {
        servico.horas = servico.horas + 1;
    }

    if (evento.target.classList.contains('menos-btn')) {
        if (servico.horas > 0) {
            servico.horas = servico.horas - 1;
        }
    }

    if (evento.target.classList.contains('remover-btn')) {
        servicos = servicos.filter((item) => {
            return item.id !== id;
        });
    }

    renderizarServicos();
    renderizarRecibo();
})

function formatarMoeda(numero) {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escaparHtml(texto) {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderizarServicos() {
    const itens = servicos.map(function (servico) {
        return `<li>
            <div class="servico-infos">
                <span class="servico-nome">${escaparHtml(servico.nome)}</span>
                <span class="servico-valor">${formatarMoeda(servico.valor)} por ${servico.unidade}</span>
                <button type="button" aria-label="Remover serviço ${escaparHtml(servico.nome)}" class="remover-btn" data-id="${servico.id}">Remover</button>
            </div>

            <div class="servico-controles">
                <button type="button" aria-label="Menos uma hora de ${escaparHtml(servico.nome)}" class="menos-btn" data-id="${servico.id}">−</button>
                <span aria-live="polite" class="servico-horas">${formatarQuantidade(servico)}</span>
                <button type="button" aria-label="Mais uma hora de ${escaparHtml(servico.nome)}" class="mais-btn" data-id="${servico.id}">+</button>
            </div>
        </li>`;
    });

    servicosLista.innerHTML = itens.join('');
}

function renderizarRecibo() {
    const escolhidos = servicos.filter(function (servico) {
        return servico.horas > 0;
    });

    const itens = escolhidos.map(function (servico) {
        return `<li>
            <span class="recibo-servico">${escaparHtml(servico.nome)}</span>
            <dl>
                <dt>${formatarQuantidade(servico)} × ${formatarMoeda(servico.valor)}</dt>
                <dd>${formatarMoeda(servico.horas * servico.valor)}</dd>
            </dl>
        </li>`;
    });

    reciboLista.innerHTML = itens.join('');

    let subtotal = 0;
    
    for (const servico of servicos) {
        subtotal = subtotal + servico.horas * servico.valor;
    }

    subtotalValor.textContent = formatarMoeda(subtotal);
    totalValor.textContent = formatarMoeda(subtotal);
}

function resetarFormulario() {
    formServico.reset();
    mensagemErro.hidden = true;

    cobrado = 'hora';

    const botoes = opcoesCobranca.querySelectorAll('button');

    botoes.forEach((botao) => {
        if (botao.dataset.unidade === 'hora') {
            botao.setAttribute('aria-pressed', 'true');
        } else {
            botao.setAttribute('aria-pressed', 'false');
        }
    });
}

function formatarQuantidade(servico) {
    if (servico.unidade === 'hora') {
        return `${servico.horas} h`;
    }

    if (servico.unidade === 'dia') {
        if (servico.horas === 1) {
            return `${servico.horas} dia`;
        }

        return `${servico.horas} dias`;
    }

    if (servico.unidade === 'projeto') {
        if (servico.horas === 1) {
            return `${servico.horas} projeto`;
        }

        return `${servico.horas} projetos`;
    }
}

adicionarBtn.addEventListener('click', () => {
    modalServico.showModal();
    mensagemErro.hidden = true;
});

cancelarBtn.addEventListener('click', () => {
    modalServico.close();
    resetarFormulario(); 
});

formServico.addEventListener('submit', (evento) => {
    const nome = campoNome.value.trim();
    const valor = Number(campoValor.value.trim().replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
        evento.preventDefault();
        mensagemErro.hidden = false;
        return;
    }

    mensagemErro.hidden = true;

    servicos.push(
        {
            id: Date.now(),
            nome: nome,
            valor: valor,
            horas: 1,
            unidade: cobrado,
        }
    );

    renderizarServicos();
    renderizarRecibo();

    resetarFormulario();
});

opcoesCobranca.addEventListener('click', (evento) => {
    if (evento.target.tagName !== 'BUTTON') {
        return;
    }

    const botoes = opcoesCobranca.querySelectorAll('button');

    botoes.forEach((botao) => {
        botao.setAttribute('aria-pressed', 'false');
    });

    evento.target.setAttribute('aria-pressed', 'true');

    cobrado = evento.target.dataset.unidade;
});

urgenteBtn.addEventListener('click', () => {
    if (urgenteBtn.getAttribute('aria-pressed') === 'true') {
        urgenteBtn.setAttribute('aria-pressed', 'false');
    } else {
        urgenteBtn.setAttribute('aria-pressed', 'true');
    }
});

renderizarRecibo();
renderizarServicos();

