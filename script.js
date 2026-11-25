
/* CADASTRO DOS PACOTES */

const pacotes = [
    {
        id: 1,
        nome: "Paraíso Tropical",
        preco: 899.00
    },
    {
        id: 2,
        nome: "Experiência Premium",
        preco: 1499.00
    },
    {
        id: 3,
        nome: "Refúgio a Dois",
        preco: 1199.00
    }
];


/* CARRINHO */

let carrinho = [];


/* FORMATAÇÃO DO PREÇO */

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


/* ADICIONAR PACOTE */

function adicionarCarrinho(id) {

    const pacote = pacotes.find(item => item.id === id);

    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            ...pacote,
            quantidade: 1
        });
    }

    atualizarCarrinho();

    abrirCarrinho();
}


/* ABRIR CARRINHO */

function abrirCarrinho() {

    document.getElementById("cart-sidebar")
        .classList.add("active");

    document.getElementById("overlay")
        .classList.add("active");

    document.body.style.overflow = "hidden";
}


/* FECHAR CARRINHO */

function fecharCarrinho() {

    document.getElementById("cart-sidebar")
        .classList.remove("active");

    document.getElementById("overlay")
        .classList.remove("active");

    document.body.style.overflow = "";
}


/* ATUALIZAR CARRINHO */

function atualizarCarrinho() {

    const container = document.getElementById("cart-items");

    const contador = document.getElementById("cart-count");

    const totalElemento = document.getElementById("cart-total");

    let total = 0;
    let quantidadeTotal = 0;

    container.innerHTML = "";

    if (carrinho.length === 0) {

        container.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-basket-shopping"></i>
                <h3>Seu carrinho está vazio!</h3>
                <p>Adicione um pacote especial e comece sua próxima aventura.</p>
            </div>
        `;

    }

    carrinho.forEach(item => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        quantidadeTotal += item.quantidade;

        container.innerHTML += `

            <div class="cart-item">

                <div>

                    <h4>${item.nome}</h4>

                    <small>${formatarPreco(item.preco)}</small>

                    <div class="quantity">

                        <button onclick="alterarQuantidade(${item.id}, -1)">
                            -
                        </button>

                        <span>${item.quantidade}</span>

                        <button onclick="alterarQuantidade(${item.id}, 1)">
                            +
                        </button>

                    </div>

                </div>

                <div style="text-align:right">

                    <strong>${formatarPreco(subtotal)}</strong>

                    <br><br>

                    <button class="remove-item"
                        onclick="removerItem(${item.id})"
                        aria-label="Remover ${item.nome}">
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </div>

        `;

    });

    contador.textContent = quantidadeTotal;

    totalElemento.textContent = formatarPreco(total);

}


/* ALTERAR QUANTIDADE */

function alterarQuantidade(id, valor) {

    const item = carrinho.find(item => item.id === id);

    if (!item) return;

    item.quantidade += valor;

    if (item.quantidade <= 0) {

        removerItem(id);

        return;

    }

    atualizarCarrinho();

}


/* REMOVER ITEM */

function removerItem(id) {

    carrinho = carrinho.filter(item => item.id !== id);

    atualizarCarrinho();

}


/* FINALIZAR COMPRA */

function finalizarCompra() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio! Adicione um pacote primeiro.");

        return;

    }

    let resumo = "Olá! Gostaria de solicitar os seguintes pacotes especiais:\n\n";

    let total = 0;

    carrinho.forEach(item => {

        const subtotal = item.preco * item.quantidade;

        total += subtotal;

        resumo += `${item.nome}\n`;
        resumo += `Quantidade: ${item.quantidade}\n`;
        resumo += `Subtotal: ${formatarPreco(subtotal)}\n\n`;

    });

    resumo += `TOTAL: ${formatarPreco(total)}`;

    /*
      SUBSTITUA PELO NÚMERO DE WHATSAPP DA EMPRESA.
      Formato: 55 + DDD + número.
    */

    const telefone = "5511999999999";

    const mensagem = encodeURIComponent(resumo);

    const link = `https://wa.me/${telefone}?text=${mensagem}`;

    window.open(link, "_blank");

}


/* INICIALIZAÇÃO */

atualizarCarrinho();


/* FECHAR CARRINHO COM ESC */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        fecharCarrinho();
    }

});



/* =====================================
   NAVEGAÇÃO DINÂMICA
===================================== */

const linksMenu = document.querySelectorAll(".nav-links a");

const secoes = document.querySelectorAll(
    "header[id], section[id]"
);

const observadorMenu = new IntersectionObserver((entradas) => {

    entradas.forEach(entrada => {

        if (entrada.isIntersecting) {

            const idAtual = entrada.target.id;

            linksMenu.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === "#" + idAtual) {
                    link.classList.add("active");
                }

            });

        }

    });

}, {
    rootMargin: "-30% 0px -60% 0px"
});

secoes.forEach(secao => {
    observadorMenu.observe(secao);
});
 
/* =====================================
   MENU MOBILE
===================================== */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

    linksMenu.forEach(link => {

        link.addEventListener("click", () => {
            navLinks.classList.remove("show");
        });

    });

}
 
/* =====================================
   PESQUISA DO SITE
===================================== */

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (searchForm && searchInput) {

    searchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const pesquisa = searchInput.value
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        if (!pesquisa) return;

        const linkEncontrado = Array.from(linksMenu).find(link => {

            const texto = link.textContent
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return texto.includes(pesquisa);

        });

        if (linkEncontrado) {

            const destino = document.querySelector(
                linkEncontrado.getAttribute("href")
            );

            if (destino) {

                destino.scrollIntoView({
                    behavior: "smooth"
                });

                linksMenu.forEach(link => {
                    link.classList.remove("active");
                });

                linkEncontrado.classList.add("active");

                navLinks?.classList.remove("show");

                searchInput.value = "";

            }

        } else {

            alert("Não encontramos essa seção. Tente pesquisar por massagens, produtos ou pacotes.");

        }

    });

}





const carrinho = [];

const itensCarrinho = document.getElementById("itensCarrinho");
const subtotalCarrinho = document.getElementById("subtotalCarrinho");

function moeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// ABRIR E FECHAR DETALHES NO PRÓPRIO CARD

document.querySelectorAll(".card-servico").forEach(card => {

    const botao = card.querySelector(".botao-detalhes");

    botao.addEventListener("click", () => {

        card.classList.toggle("detalhes-abertos");

        botao.textContent =
            card.classList.contains("detalhes-abertos")
            ? "Ocultar detalhes ↑"
            : "Conhecer experiência →";

    });

});


// ADICIONAR AO CARRINHO

document.querySelectorAll(".card-servico").forEach(card => {

    card.querySelectorAll(".botao-adicionar").forEach(botao => {

        botao.addEventListener("click", () => {

            const id = card.dataset.id;

            const existente = carrinho.find(item => item.id === id);

            if (existente) {

                existente.quantidade++;

            } else {

                carrinho.push({
                    id: id,
                    nome: card.dataset.nome,
                    preco: Number(card.dataset.preco),
                    imagem: card.dataset.imagem,
                    quantidade: 1
                });

            }

            atualizarCarrinho();

            // Leva o visitante até o carrinho na mesma página.
            document.getElementById("carrinho").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

});


// ATUALIZAR CARRINHO

function atualizarCarrinho() {

    itensCarrinho.replaceChildren();

    let subtotal = 0;

    if (carrinho.length === 0) {

        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <span>♡</span>
                <h3>Seu carrinho está vazio</h3>
                <p>Escolha uma experiência para começar.</p>
            </div>
        `;

    }

    carrinho.forEach(item => {

        subtotal += item.preco * item.quantidade;

        const elemento = document.createElement("div");

        elemento.className = "item-carrinho";

        const imagem = document.createElement("img");
        imagem.src = item.imagem;
        imagem.alt = item.nome;

        const dados = document.createElement("div");
        dados.className = "dados-item";

        const nome = document.createElement("h4");
        nome.textContent = item.nome;

        const preco = document.createElement("strong");
        preco.textContent = moeda(item.preco * item.quantidade);

        const controles = document.createElement("div");
        controles.className = "controle-quantidade";

        const diminuir = document.createElement("button");
        diminuir.textContent = "−";
        diminuir.dataset.acao = "diminuir";
        diminuir.dataset.id = item.id;

        const quantidade = document.createElement("span");
        quantidade.textContent = item.quantidade;

        const aumentar = document.createElement("button");
        aumentar.textContent = "+";
        aumentar.dataset.acao = "aumentar";
        aumentar.dataset.id = item.id;

        const remover = document.createElement("button");
        remover.textContent = "×";
        remover.className = "remover-item";
        remover.dataset.acao = "remover";
        remover.dataset.id = item.id;

        controles.append(
            diminuir,
            quantidade,
            aumentar,
            remover
        );

        dados.append(nome, preco, controles);

        elemento.append(imagem, dados);

        itensCarrinho.appendChild(elemento);

    });

    subtotalCarrinho.textContent = moeda(subtotal);

}


// CONTROLES DO CARRINHO

itensCarrinho.addEventListener("click", event => {

    const botao = event.target.closest("button[data-acao]");

    if (!botao) return;

    const item = carrinho.find(
        produto => produto.id === botao.dataset.id
    );

    if (!item) return;

    if (botao.dataset.acao === "aumentar") {
        item.quantidade++;
    }

    if (botao.dataset.acao === "diminuir") {
        item.quantidade--;

        if (item.quantidade <= 0) {
            carrinho.splice(carrinho.indexOf(item), 1);
        }
    }

    if (botao.dataset.acao === "remover") {
        carrinho.splice(carrinho.indexOf(item), 1);
    }

    atualizarCarrinho();

});


// RESUMO DA COMPRA

document.getElementById("finalizarCompra").addEventListener("click", () => {

    if (carrinho.length === 0) {
        alert("Adicione um serviço antes de continuar!");
        return;
    }

    const resumo = carrinho.map(item =>
        `${item.quantidade}x ${item.nome} - ${
            moeda(item.preco * item.quantidade)
        }`
    ).join("\n");

    const total = carrinho.reduce(
        (soma, item) => soma + item.preco * item.quantidade,
        0
    );

    alert(
        "SEU PEDIDO MARESIA\n\n" +
        resumo +
        "\n\nTOTAL: " + moeda(total)
    );

});


// INICIALIZAR

atualizarCarrinho();
