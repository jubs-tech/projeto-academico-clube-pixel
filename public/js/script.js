// Valida o formulário sem enviar dados para um serviço externo.
const botaoEnviar = document.querySelector("#form-contato button");
const campoNome = document.querySelector("#nome");
const campoEmail = document.querySelector("#email");
const campoMensagem = document.querySelector("#mensagem");

// Destaca o campo inválido e posiciona o foco para correção.
function mostrarErro(campo, aviso) {
    campo.classList.add("campo-erro");
    campo.setAttribute("aria-invalid", "true");
    alert(aviso);
    campo.focus();
}

// Remove o destaque de erro assim que o estudante edita o campo.
function limparErro(evento) {
    evento.target.classList.remove("campo-erro");
    evento.target.removeAttribute("aria-invalid");
}

campoNome.addEventListener("input", limparErro);
campoEmail.addEventListener("input", limparErro);
campoMensagem.addEventListener("input", limparErro);

botaoEnviar.addEventListener("click", () => {
    const nome = campoNome.value.trim();
    if (nome === "") {
        mostrarErro(campoNome, "Por favor, informe seu nome.");
        return;
    }

    const email = campoEmail.value.trim();
    if (email === "") {
        mostrarErro(campoEmail, "Por favor, informe seu e-mail.");
        return;
    }
    if (!campoEmail.checkValidity()) {
        mostrarErro(campoEmail, "Por favor, digite um e-mail válido.");
        return;
    }

    const mensagem = campoMensagem.value.trim();
    if (mensagem === "") {
        mostrarErro(campoMensagem, "Por favor, escreva sua mensagem.");
        return;
    }

    // A validação é demonstrativa: o site ainda não envia mensagens de contato.
    alert("Campos preenchidos corretamente! Esta é uma demonstração: a mensagem não foi enviada.");
});

// Organiza a abertura, o fechamento e o envio de mensagens da Nubi.
document.addEventListener("DOMContentLoaded", () => {
    const botaoAbrir = document.getElementById("chat-toggle");
    const painelChat = document.getElementById("chat");
    const botaoFechar = document.getElementById("fechar");
    const botaoEnviarNubi = document.getElementById("enviar");
    const campoNubi = document.getElementById("input");
    const caixaMensagens = document.getElementById("chat-box");
    const sessaoNubi = crypto.randomUUID();

    // Mantém o estado do botão sincronizado com a visibilidade da conversa.
    botaoAbrir.setAttribute("aria-controls", "chat");
    botaoAbrir.setAttribute("aria-expanded", "false");
    botaoAbrir.setAttribute("aria-label", "Conversar com a Nubi");

    function abrirChat() {
        painelChat.classList.remove("hidden");
        botaoAbrir.classList.add("aberto");
        botaoAbrir.setAttribute("aria-expanded", "true");
        botaoAbrir.setAttribute("aria-label", "Fechar conversa com a Nubi");
        campoNubi.focus();
    }

    function fecharChat() {
        painelChat.classList.add("hidden");
        botaoAbrir.classList.remove("aberto");
        botaoAbrir.setAttribute("aria-expanded", "false");
        botaoAbrir.setAttribute("aria-label", "Conversar com a Nubi");
        botaoAbrir.focus();
    }

    // O botão flutuante alterna entre abrir e fechar a conversa.
    botaoAbrir.addEventListener("click", () => {
        if (painelChat.classList.contains("hidden")) {
            abrirChat();
        } else {
            fecharChat();
        }
    });

    botaoFechar.addEventListener("click", fecharChat);

    // Enter envia a mensagem; Esc fecha a conversa e devolve o foco ao botão.
    campoNubi.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" && !evento.isComposing) {
            evento.preventDefault();
            botaoEnviarNubi.click();
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && !painelChat.classList.contains("hidden")) {
            fecharChat();
        }
    });

    // A pergunta continua sendo enviada ao servidor, que consulta a IA real.
    botaoEnviarNubi.addEventListener("click", async () => {
        const mensagem = campoNubi.value.trim();
        if (!mensagem || botaoEnviarNubi.disabled) return;

        const mensagemUsuario = document.createElement("div");
        mensagemUsuario.className = "usuario";
        mensagemUsuario.textContent = mensagem;
        caixaMensagens.appendChild(mensagemUsuario);

        campoNubi.value = "";
        caixaMensagens.scrollTop = caixaMensagens.scrollHeight;
        botaoEnviarNubi.disabled = true;
        caixaMensagens.setAttribute("aria-busy", "true");

        try {
            const resposta = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensagem: mensagem,
                    sessionId: sessaoNubi
                })
            });

            const dados = await resposta.json();
            if (!resposta.ok) {
                throw new Error(dados.erro || "Falha ao consultar a Nubi.");
            }

            const mensagemNubi = document.createElement("div");
            mensagemNubi.className = "bot";
            mensagemNubi.textContent =
                dados.resposta || dados.erro || "Não consegui responder agora.";
            caixaMensagens.appendChild(mensagemNubi);

        } catch (erro) {
            console.error("Erro na comunicação com a Nubi:", erro);
            const aviso = document.createElement("div");
            aviso.className = "bot";
            aviso.textContent = "Não consegui me conectar agora. Tente novamente em instantes.";
            caixaMensagens.appendChild(aviso);
        } finally {
            botaoEnviarNubi.disabled = false;
            caixaMensagens.setAttribute("aria-busy", "false");
            caixaMensagens.scrollTop = caixaMensagens.scrollHeight;
        }
    });
});

// Menu do celular: o botão com ícone abre e fecha a lista de links.
const cabecalho = document.querySelector("header");
const botaoMenu = document.getElementById("menu-toggle");
const menuPrincipal = document.getElementById("menu-principal");

// Com o JavaScript ativo, o CSS esconde os links atrás do botão.
cabecalho.classList.add("menu-pronto");

function abrirMenu() {
    cabecalho.classList.add("menu-aberto");
    document.documentElement.classList.add("menu-sem-rolagem");
    botaoMenu.setAttribute("aria-expanded", "true");
    botaoMenu.setAttribute("aria-label", "Fechar menu");
}

function fecharMenu() {
    cabecalho.classList.remove("menu-aberto");
    document.documentElement.classList.remove("menu-sem-rolagem");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
}

botaoMenu.addEventListener("click", () => {
    if (cabecalho.classList.contains("menu-aberto")) {
        fecharMenu();
    } else {
        abrirMenu();
    }
});

// Ao escolher uma seção, o menu se fecha para mostrar o conteúdo.
menuPrincipal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", fecharMenu);
});

// Tocar fora do menu (inclusive no fundo escurecido) também fecha o menu.
document.addEventListener("click", (evento) => {
    // O fundo escurecido é desenhado pelo próprio header (::after),
    // então tocar nele conta como tocar no header.
    const tocouFora = !cabecalho.contains(evento.target) || evento.target === cabecalho;
    if (cabecalho.classList.contains("menu-aberto") && tocouFora) {
        fecharMenu();
    }
});

// Esc fecha o menu e devolve o foco ao botão.
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && cabecalho.classList.contains("menu-aberto")) {
        fecharMenu();
        botaoMenu.focus();
    }
});

// Se a tela ficar larga (ex.: celular deitado), o menu volta ao normal.
window.matchMedia("(min-width: 720px)").addEventListener("change", (mudanca) => {
    if (mudanca.matches) fecharMenu();
});

// Destaca no menu a seção que ocupa a região central da tela.
function marcarMenuAtivo() {
    const links = document.querySelectorAll('nav a[href^="#"]');
    const secoes = document.querySelectorAll("main section[id]");
    const meioDaTela = window.innerHeight / 2;
    let idAtual = "inicio";

    // A última seção que alcançou o meio da tela fica selecionada.
    secoes.forEach((secao) => {
        if (secao.getBoundingClientRect().top <= meioDaTela) {
            idAtual = secao.id;
        }
    });

    // Somente o link correspondente recebe o estilo visual de ativo.
    links.forEach((link) => {
        link.classList.toggle("ativo", link.getAttribute("href") === "#" + idAtual);
    });
}

window.addEventListener("scroll", marcarMenuAtivo);
window.addEventListener("resize", marcarMenuAtivo);
marcarMenuAtivo();
