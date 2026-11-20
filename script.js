const servicos = [
    {
        id: 1,
        nome: "Gestão de e-mails",
        valor: 40,
        horas: 6
    },

    {
        id: 2,
        nome: "Agenda e agendamentos",
        valor: 40,
        horas: 4
    },

    {
        id: 3,
        nome: "Conciliação financeira",
        valor: 55,
        horas: 8
    }
];

const servicosLista = document.querySelector('#servicos-lista');
const reciboLista = document.querySelector('#recibo-lista');
const subtotalValor = document.getElementById('subtotal-valor');
const totalValor = document.getElementById('total-valor');

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

    renderizarServicos();
    renderizarRecibo();
})

function formatarMoeda(numero) {
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderizarServicos() {
    const itens = servicos.map(function (servico) {
        return `<li>
            <div class="servico-infos">
                <span class="servico-nome">${servico.nome}</span>
                <span class="servico-valor">${formatarMoeda(servico.valor)} por hora</span>
                <button type="button" aria-label="Remover serviço ${servico.nome}" class="remover-btn" data-id="${servico.id}">Remover</button>
            </div>

            <div class="servico-controles">
                <button type="button" aria-label="Menos uma hora de ${servico.nome}" class="menos-btn" data-id="${servico.id}">−</button>
                <span aria-live="polite" class="servico-horas">${servico.horas} h</span>
                <button type="button" aria-label="Mais uma hora de ${servico.nome}" class="mais-btn" data-id="${servico.id}">+</button>
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
            <span class="recibo-servico">${servico.nome}</span>
            <dl>
                <dt>${servico.horas} h × ${formatarMoeda(servico.valor)}</dt>
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
renderizarRecibo();
renderizarServicos();

