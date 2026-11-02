console.log("JavaScript do Clube Pixel carregado!");

const botaoEnviar = document.querySelector('#form-contato button');
botaoEnviar.addEventListener('click', function() {

    const campoNome = document.querySelector('#nome');
    const nome = campoNome.value.trim();
    if (nome === '') {
        alert('Por favor, informe seu nome.');
        return;
    }
    
    const campoEmail = document.querySelector('#email');
    const email = campoEmail.value.trim();
    if (email === '') {
        alert('Por favor, informe seu e-mail.');
        return;
    }
    if (!campoEmail.checkValidity()) {
        alert('Por favor, digite um e-mail válido.');
        return;
    }

    
    const campoMensagem = document.querySelector('#mensagem');
    const mensagem = campoMensagem.value.trim();
    if (mensagem === '') {
        alert('Por favor, escreva sua mensagem.');
        return;
    }   
    alert('Campos preenchidos corretamente! Esta é uma demonstração: a mensagem não foi enviada.');

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
