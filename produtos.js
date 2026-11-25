
document.addEventListener("DOMContentLoaded", function () {

    // IDENTIFICA OS 3 CARROSSEIS
    const carrosseis = document.querySelectorAll(".carrossel");

    carrosseis.forEach(function (carrossel) {

        const trilho = carrossel.querySelector(".produtos-trilho");
        const botaoAnterior = carrossel.querySelector(".anterior");
        const botaoProximo = carrossel.querySelector(".proximo");

        if (!trilho || !botaoAnterior || !botaoProximo) {
            console.error("Estrutura do carrossel incompleta.");
            return;
        }

        let indice = 0;
        let quantidade = 3;
        let animando = false;

        const velocidade = 650;

        // DESCOBRE QUANTOS PRODUTOS APARECEM
        function produtosVisiveis() {

            if (window.innerWidth <= 550) return 1;

            if (window.innerWidth <= 850) return 2;

            return 3;
        }

        // DESCOBRE A DISTÂNCIA ENTRE OS PRODUTOS
        function distanciaProduto() {

            const primeiro = trilho.children[0];

            const estilo = window.getComputedStyle(trilho);

            const espacamento = parseFloat(estilo.gap) || 0;

            return primeiro.getBoundingClientRect().width + espacamento;
        }

        // MONTA O LOOP INFINITO
        function prepararCarrossel() {

            // REMOVE CÓPIAS ANTIGAS
            trilho.querySelectorAll("[data-clone='true']").forEach(function (clone) {
                clone.remove();
            });

            const originais = Array.from(trilho.children);

            if (originais.length === 0) return;

            quantidade = produtosVisiveis();

            // CRIA CÓPIAS NO INÍCIO
            const inicio = document.createDocumentFragment();

            for (let i = 0; i < quantidade; i++) {

                const posicao =
                    ((originais.length - quantidade + i) % originais.length);

                const copia = originais[posicao].cloneNode(true);

                copia.dataset.clone = "true";

                inicio.appendChild(copia);
            }

            // CRIA CÓPIAS NO FINAL
            const final = document.createDocumentFragment();

            for (let i = 0; i < quantidade; i++) {

                const copia = originais[i % originais.length].cloneNode(true);

                copia.dataset.clone = "true";

                final.appendChild(copia);
            }

            trilho.prepend(inicio);
            trilho.append(final);

            // COMEÇA NOS PRODUTOS ORIGINAIS
            indice = quantidade;

            trilho.style.transition = "none";

            trilho.style.transform =
                `translateX(-${distanciaProduto() * indice}px)`;

            // REINICIA A ANIMAÇÃO
            trilho.offsetHeight;

            trilho.style.transition = "";

            animando = false;
        }

        // MOVIMENTA O CARROSSEL
        function movimentar(direcao) {

            if (animando) return;

            animando = true;

            indice += direcao;

            trilho.style.transition =
                `transform ${velocidade}ms cubic-bezier(.22,.61,.36,1)`;

            trilho.style.transform =
                `translateX(-${distanciaProduto() * indice}px)`;
        }

        // QUANDO A ANIMAÇÃO TERMINAR
        trilho.addEventListener("transitionend", function (evento) {

            if (evento.target !== trilho ||
                evento.propertyName !== "transform") return;

            const originais =
                trilho.querySelectorAll(":scope > :not([data-clone='true'])");

            const total = originais.length;

            if (total === 0) return;

            // CHEGOU AO FINAL: VOLTA AO COMEÇO
            if (indice >= quantidade + total) {

                indice = quantidade;

            }

            // CHEGOU AO INÍCIO: VAI PARA O FINAL
            if (indice < quantidade) {

                indice = quantidade + total - 1;

            }

            // REPOSICIONAMENTO INVISÍVEL
            trilho.style.transition = "none";

            trilho.style.transform =
                `translateX(-${distanciaProduto() * indice}px)`;

            trilho.offsetHeight;

            trilho.style.transition = "";

            animando = false;

        });

        // CONCHA DIREITA
        botaoProximo.addEventListener("click", function () {

            movimentar(1);

        });

        // CONCHA ESQUERDA
        botaoAnterior.addEventListener("click", function () {

            movimentar(-1);

        });

        // AJUSTA O CARROSSEL QUANDO A TELA MUDA
        let redimensionamento;

        window.addEventListener("resize", function () {

            clearTimeout(redimensionamento);

            redimensionamento = setTimeout(function () {

                prepararCarrossel();

            }, 200);

        });

        // INICIA
        prepararCarrossel();

    });

    console.log(
        "Maresia: " + carrosseis.length + " carrosséis infinitos inicializados!"
    );

});


// agendamento

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formAgendamento");

    const nome = document.getElementById("nome");
    const telefone = document.getElementById("telefone");
    const servico = document.getElementById("servico");
    const data = document.getElementById("data");
    const horario = document.getElementById("horario");
    const observacao = document.getElementById("observacao");

    // RESUMO
    const resumoNome = document.getElementById("resumoNome");
    const resumoServico = document.getElementById("resumoServico");
    const resumoData = document.getElementById("resumoData");
    const resumoHorario = document.getElementById("resumoHorario");

    // COLOQUE AQUI O WHATSAPP DA EMPRESA
    // Exemplo: 5535999999999
    const whatsappEmpresa = "55DDDNUMERO";


    // DATA MÍNIMA: HOJE
    const hoje = new Date();

    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    const dataAtual = `${ano}-${mes}-${dia}`;

    data.min = dataAtual;


    // GERAR HORÁRIOS
    function gerarHorarios() {

        horario.innerHTML = '<option value="">Selecione um horário</option>';

        if (!data.value) {
            horario.disabled = true;
            return;
        }

        const dataEscolhida = new Date(data.value + "T12:00:00");

        const diaSemana = dataEscolhida.getDay();

        if (diaSemana === 0) {
            horario.innerHTML = '<option value="">Não atendemos aos domingos</option>';
            horario.disabled = true;
            return;
        }

        const agora = new Date();

        for (let hora = 9; hora <= 17; hora++) {

            for (let minuto of [0, 30]) {

                if (hora === 17 && minuto === 30) continue;

                const horarioTexto =
                    `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;

                // Não oferece horários que já passaram hoje
                if (data.value === dataAtual) {

                    const horarioData = new Date(data.value + "T" + horarioTexto);

                    if (horarioData <= agora) continue;
                }

                const opcao = document.createElement("option");

                opcao.value = horarioTexto;
                opcao.textContent = horarioTexto;

                horario.appendChild(opcao);
            }
        }

        horario.disabled = false;

        if (horario.options.length === 1) {
            horario.innerHTML = '<option value="">Não há horários disponíveis</option>';
            horario.disabled = true;
        }
    }


    // ATUALIZAR RESUMO
    function atualizarResumo() {

        resumoNome.textContent =
            nome.value || "Não informado";

        resumoServico.textContent =
            servico.value || "Não selecionado";

        resumoData.textContent =
            data.value
                ? data.value.split("-").reverse().join("/")
                : "Não selecionada";

        resumoHorario.textContent =
            horario.value || "Não selecionado";
    }


    // EVENTOS
    data.addEventListener("change", function () {
        gerarHorarios();
        atualizarResumo();
    });

    nome.addEventListener("input", atualizarResumo);
    servico.addEventListener("change", atualizarResumo);
    horario.addEventListener("change", atualizarResumo);


    // ENVIAR AGENDAMENTO
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        if (!formulario.reportValidity()) return;

        if (!/^\d{12,13}$/.test(whatsappEmpresa)) {
            alert("Configure o número de WhatsApp da empresa no arquivo agendamento.js.");
            return;
        }

        const mensagem = `
Olá! Gostaria de solicitar um agendamento na Maresia Cosméticos.

Nome: ${nome.value}
Telefone: ${telefone.value}
Serviço: ${servico.value}
Data: ${data.value.split("-").reverse().join("/")}
Horário: ${horario.value}

Observações: ${observacao.value || "Nenhuma"}

Aguardo a confirmação da disponibilidade. Obrigado!
        `;

        const link =
            "https://wa.me/" +
            whatsappEmpresa +
            "?text=" +
            encodeURIComponent(mensagem);

        window.open(link, "_blank");

    });


    atualizarResumo();

});
// agendamento




const menu = document.querySelector("#menu");
const indicador = document.querySelector(".indicador");
const itens = document.querySelectorAll(".produto-aba");

// Produtos será o item selecionado inicialmente
const itemAtivo = 3;

// Função que movimenta o fundo branco
function moverIndicador(item) {

    const largura = item.offsetWidth;
    const posicao = item.offsetLeft;

    indicador.style.width = largura + "px";

    indicador.style.transform =
        `translate(${posicao}px, -50%)`;
}

// Posição inicial
moverIndicador(itens[itemAtivo]);

// Movimento ao passar o mouse
itens.forEach((item) => {

    item.addEventListener("mouseenter", () => {
        moverIndicador(item);
    });

});

// Volta para Produtos quando o mouse sair
menu.addEventListener("mouseleave", () => {
    moverIndicador(itens[itemAtivo]);
});

// Também funciona com navegação pelo teclado
itens.forEach((item) => {

    const link = item.querySelector("a");

    link.addEventListener("focus", () => {
        moverIndicador(item);
    });

});

menu.addEventListener("focusout", () => {
    setTimeout(() => {
        if (!menu.contains(document.activeElement)) {
            moverIndicador(itens[itemAtivo]);
        }
    }, 0);
});

// Ajusta a posição quando a tela mudar de tamanho
window.addEventListener("resize", () => {
    moverIndicador(itens[itemAtivo]);
});




