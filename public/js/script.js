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

// Abrir e fechar o chat da Nubi
document.addEventListener("DOMContentLoaded", () => {
    const botaoAbrir = document.getElementById("chat-toggle");
    const painelChat = document.getElementById("chat");
    const botaoFechar = document.getElementById("fechar");

    botaoAbrir.addEventListener("click", () => {
        painelChat.classList.remove("hidden");
    });

    botaoFechar.addEventListener("click", () => {
        painelChat.classList.add("hidden");
    });
    // Enviar perguntas da Nubi ao servidor
    const botaoEnviarNubi = document.getElementById("enviar");
    const campoNubi = document.getElementById("input");
    const sessaoNubi = crypto.randomUUID();
    const caixaMensagens = document.getElementById("chat-box");

    botaoEnviarNubi.addEventListener("click", async () => {
        const mensagem = campoNubi.value.trim();

        if (!mensagem) return;

        // Mostra a mensagem enviada pelo usuário
        const mensagemUsuario = document.createElement("div");

        mensagemUsuario.className = "usuario";
        mensagemUsuario.textContent = mensagem;

        caixaMensagens.appendChild(mensagemUsuario);

        // Limpa o campo depois de enviar
        campoNubi.value = "";

        caixaMensagens.scrollTop = caixaMensagens.scrollHeight;

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
            const mensagemNubi = document.createElement("div");

            mensagemNubi.className = "bot";
            mensagemNubi.textContent =
                dados.resposta || dados.erro || "Não consegui responder agora.";

            caixaMensagens.appendChild(mensagemNubi);
            caixaMensagens.scrollTop = caixaMensagens.scrollHeight;

        } catch (erro) {
            console.error("Erro na comunicação com a Nubi:", erro);
        }
    });
});