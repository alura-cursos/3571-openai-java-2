package br.com.alura.ecomart.chatbot.domain.service;

import br.com.alura.ecomart.chatbot.infra.openai.DadosRequisicaoChatCompletion;
import br.com.alura.ecomart.chatbot.infra.openai.OpenAIClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatbotService {

    private OpenAIClient client;

    public ChatbotService(OpenAIClient client) {
        this.client = client;
    }

    public String responderPergunta(String pergunta) {
        var promptSistema = "Você é um chatbot de atendimento a clientes de um ecommerce e deve responder apenas perguntas relacionadas com o ecommerce";
        var dados = new DadosRequisicaoChatCompletion(promptSistema, pergunta);
        return client.enviarRequisicaoChatCompletion(dados);
    }

    public List<String> carregarHistorico() {
        return client.carregarHistoricoDeMensagens();
    }

    public void limparHistorico() {
        client.apagarThread();
    }
}
