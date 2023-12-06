const chat = document.querySelector('#chat');
const input = document.querySelector('#input');
const botaoEnviar = document.querySelector('#botao-enviar');

botaoEnviar.addEventListener('click', enviarMensagem);

input.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        botaoEnviar.click();
    }
});

document.addEventListener('DOMContentLoaded', vaiParaFinalDoChat);

async function enviarMensagem() {
    if(input.value == '' || input.value == null) return;

    const mensagem = input.value;
    input.value = '';

    const novaBolha = criaBolhaUsuario();
    novaBolha.innerHTML = mensagem;
    chat.appendChild(novaBolha);

    let novaBolhaBot = criaBolhaBot();
    chat.appendChild(novaBolhaBot);
    vaiParaFinalDoChat();

    fetch('http://localhost:8080/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'pergunta': mensagem}),
    }).then(async response => {
        if (!response.ok) {
            throw new Error('Ocorreu um erro!');
        }

        const leitorDaResposta = response.body.getReader();
        let respostaParcial = '';

        while (true) {
            const {
                done: terminou,
                value: pedacoDaResposta
            } = await leitorDaResposta.read();

            if (terminou) break;

            respostaParcial += new TextDecoder().decode(pedacoDaResposta);
            novaBolhaBot.innerHTML = marked.parse(respostaParcial);
            vaiParaFinalDoChat();
        }
    }).catch(error => {
        alert(error.message);
    });
}

function criaBolhaUsuario() {
    const bolha = document.createElement('p');
    bolha.classList = 'chat__bolha chat__bolha--usuario';
    return bolha;
}

function criaBolhaBot() {
    let bolha = document.createElement('p');
    bolha.classList = 'chat__bolha chat__bolha--bot';
    return bolha;
}

function vaiParaFinalDoChat() {
    chat.scrollTop = chat.scrollHeight;
}
