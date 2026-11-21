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
const urgencia = document.querySelector('.urgencia');
const reciboFormaPagamento = document.querySelector('.forma-pagamento');
const blocoObservacoes = document.querySelector('.observacoes');
const reciboObservacoes = document.querySelector('.recibo-observacoes');

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
const urgenciaValor = document.getElementById('urgencia-valor');
const painelDownload = document.getElementById('painel-download');
const baixarBtn = document.getElementById('baixar-btn');
const nomeCliente = document.getElementById('nome-cliente');
const reciboCliente = document.getElementById('recibo-cliente');
const formaPagamento = document.getElementById('forma-pagamento');
const campoObservacoes = document.getElementById('observacoes');
const opcoesValidade = document.getElementById('opcoes-validade');
const reciboValidade = document.getElementById('recibo-validade');
const mensagemValidade = document.getElementById('mensagem-validade');
const marca = document.getElementById('marca');
const reciboMarca = document.getElementById('titulo-secundario');
const formDownload = document.getElementById('form-download');
const copiarBtn = document.getElementById('copiar-btn');
const baixarPdfBtn = document.getElementById('baixar-pdf-btn');

let cobrado = 'hora';
let urgente = false;

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
    if (servicos.length === 0) {
        servicosLista.innerHTML = '<li class="vazio">Nenhum serviço cadastrado. Clique em "+ Adicionar serviço".</li>';
        return;
    }

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

    if (escolhidos.length === 0) {
        reciboLista.innerHTML = '<li class="vazio">Nenhum serviço escolhido ainda.</li>';
    } else {
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
    }

    let subtotal = 0;
    
    for (const servico of servicos) {
        subtotal = subtotal + servico.horas * servico.valor;
    }

    let total = subtotal;

    if (urgente) {
        const urgenciaTotal = subtotal * 0.2;

        urgenciaValor.textContent = formatarMoeda(urgenciaTotal);
        urgencia.hidden = false;

        total = total + urgenciaTotal;
    } else {
        urgencia.hidden = true;
    }

    subtotalValor.textContent = formatarMoeda(subtotal);
    totalValor.textContent = formatarMoeda(total);
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

function gerarTexto() {
    const linhas = [];

    linhas.push(reciboMarca.textContent);
    linhas.push(reciboCliente.textContent);
    linhas.push('');

    const escolhidos = servicos.filter((servico) => {
        return servico.horas > 0;
    });

    for (const servico of escolhidos) {
        linhas.push(`- ${servico.nome}: ${formatarQuantidade(servico)} × ${formatarMoeda(servico.valor)} = ${formatarMoeda(servico.horas * servico.valor)}`);
    }

    if (urgente) {
        linhas.push(`Urgência (+20%): ${urgenciaValor.textContent}`);
    }

    linhas.push('');
    linhas.push(`Total: ${totalValor.textContent}`);

    linhas.push('');
    linhas.push(`Validade: ${reciboValidade.textContent}`);
    linhas.push(`Pagamento: ${reciboFormaPagamento.textContent}`);

    if (!blocoObservacoes.hidden) {
        linhas.push('');
        linhas.push(`Observações: ${reciboObservacoes.textContent}`);
    }

    return linhas.join('\n');
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
        urgente = false;
    } else {
        urgenteBtn.setAttribute('aria-pressed', 'true');
        urgente = true;
    }

    renderizarRecibo();
});

baixarBtn.addEventListener('click', () => {
    if (baixarBtn.getAttribute('aria-expanded') === 'true') {
        baixarBtn.setAttribute('aria-expanded', 'false');
        painelDownload.hidden = true;
    } else {
        baixarBtn.setAttribute('aria-expanded', 'true');
        painelDownload.hidden = false;
    }
});

nomeCliente.addEventListener('input', () => {
    const texto = nomeCliente.value.trim();
    reciboCliente.textContent = texto || '[Nome do cliente]';
});

formaPagamento.addEventListener('input', () => {
    const texto = formaPagamento.value.trim();
    reciboFormaPagamento.textContent = texto || '[Forma de pagamento]';
});

campoObservacoes.addEventListener('input', () => {
    const texto = campoObservacoes.value.trim();

    reciboObservacoes.textContent = texto;

    blocoObservacoes.hidden = texto === '';
});

opcoesValidade.addEventListener('click', (evento) => {
    if (evento.target.tagName !== 'BUTTON') {
        return;
    }

    const botoes = opcoesValidade.querySelectorAll('button');

    botoes.forEach((botao) => {
        botao.setAttribute('aria-pressed', 'false');
    });

    evento.target.setAttribute('aria-pressed', 'true');

    const dias = evento.target.dataset.dias;

    reciboValidade.textContent = `${dias} dias`;
    mensagemValidade.textContent = `Proposta válida por ${dias} dias`;
})

marca.addEventListener('input', () => {
    const texto = marca.value.trim();
    reciboMarca.textContent = texto || '[Sua marca]';
});

formDownload.addEventListener('submit', (evento) => {
    evento.preventDefault();
});

copiarBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(gerarTexto());

    copiarBtn.textContent = 'Copiado!';

    setTimeout(() => {
        copiarBtn.textContent = 'Copiar texto';
    }, 2000);
});

baixarPdfBtn.addEventListener('click', () => {
    window.print();
});

renderizarRecibo();
renderizarServicos();

