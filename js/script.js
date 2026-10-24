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
