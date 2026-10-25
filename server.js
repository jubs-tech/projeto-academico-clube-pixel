
/*
 * CLUBE PIXEL — SERVER.JS
 *
 * Adaptado da Oficina do Atendente Virtual
 * Projeto de referência: MartinsVet com IA
 * Disciplina: Desenvolvimento Web para IA
 *
 * Fluxo:
 * Site -> Servidor Express -> Gemini -> Site
 */

// =====================================================
// 1. IMPORTAÇÕES
// =====================================================

import express from "express";
import dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import { GoogleGenAI } from "@google/genai";

import {
  PERSONA,
  CONHECIMENTO,
  REGRAS
} from "./persona.js";

// Carrega a chave armazenada no arquivo .env.
dotenv.config({ quiet: true });

// =====================================================
// 2. CONFIGURAÇÕES DO SERVIDOR
// =====================================================

const PORTA = 3000;

// Modelo que já funcionou nos testes do Clube Pixel.
const MODELO = "gemini-3.5-flash-lite";

const chave = process.env.GEMINI_API_KEY?.trim();

// Só cria o cliente Gemini se houver uma chave.
const ai = chave
  ? new GoogleGenAI({ apiKey: chave })
  : null;

const app = express();

// Permite receber mensagens em formato JSON.
app.use(express.json({ limit: "10kb" }));

// Disponibiliza HTML, CSS, JS e imagens.
app.use(express.static("public"));

if (!chave) {
  console.warn(
    "GEMINI_API_KEY ausente. Confira o arquivo .env na raiz."
  );
}

// =====================================================
// 3. INSTRUÇÕES DA NUBI
// =====================================================

const INSTRUCAO_DE_SISTEMA = `
Você é ${PERSONA.nome}, atendente virtual da
${PERSONA.empresa}.

Ramo: ${PERSONA.ramo}

Objetivo: ${PERSONA.objetivo}

Tom: ${PERSONA.tom}

=== CONHECIMENTO DO CLUBE ===

${CONHECIMENTO}

=== REGRAS ===

${REGRAS.join("\n")}

IMPORTANTE:

O acesso aos dois materiais completos do plano gratuito
AINDA NÃO FOI IMPLEMENTADO.

Não diga que o visitante já pode acessar ou utilizar
esses materiais.

O catálogo Premium, a contratação e a cobrança real
também NÃO estão disponíveis atualmente.

Não prometa notificações, cadastros ou funcionalidades
que ainda não foram implementados.

Responda em português brasileiro, com linguagem simples
e texto sem formatação markdown.
`;

// =====================================================
// 4. HISTÓRICO DAS CONVERSAS
// =====================================================

// Cada sessão mantém um histórico separado.
// Os dados ficam somente na memória do servidor.

const historicos = new Map();

function pegarHistorico(sessionId) {
  if (!historicos.has(sessionId)) {
    historicos.set(sessionId, []);
  }

  return historicos.get(sessionId);
}

// Guarda a pergunta e a resposta.
// Mantemos somente as últimas 6 trocas.
function guardarTroca(historico, pergunta, resposta) {
  historico.push({
    role: "user",
    parts: [{ text: pergunta }]
  });

  historico.push({
    role: "model",
    parts: [{ text: resposta }]
  });

  if (historico.length > 12) {
    historico.splice(0, historico.length - 12);
  }
}

// =====================================================
// 5. VERIFICAÇÃO DE INFORMAÇÕES IMPORTANTES
// =====================================================

// Remove acentos e transforma o texto em minúsculas.
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Verifica perguntas sobre funcionalidades
// que ainda não estão disponíveis no Clube Pixel.

function respostaDeDisponibilidade(mensagem) {
  const pergunta = normalizar(mensagem);

  const querAcessar =
    /acess|disponiv|liberad|contrat|assin|pagament|comprar|baixar|posso ler|onde encontro/.test(
      pergunta
    );

  if (!querAcessar) {
    return null;
  }

  // Plano Premium
  if (/premium|assinatura|cobranca|pagamento/.test(pergunta)) {
    return (
      "O Pixel Premium é uma proposta de R$ 19,90 por mês, " +
      "mas o acesso ao catálogo, a contratação e a cobrança real " +
      "ainda não foram implementados no Clube Pixel."
    );
  }

  // Materiais e plano gratuito
  if (/materia(l|is)|gratuit|gratis|catalogo|conteudo/.test(pergunta)) {
    return (
      "Os dois materiais gratuitos fazem parte da proposta " +
      "do Clube Pixel, mas o acesso a eles ainda não foi implementado. " +
      "Por enquanto, você pode conhecer os benefícios planejados para o clube."
    );
  }

  return null;
}

// =====================================================
// 6. ROTA DO CHAT — POST /api/chat
// =====================================================

app.post("/api/chat", async (req, res) => {
  const mensagem = req.body?.mensagem;
  const sessionId = req.body?.sessionId;

  // Impede mensagens vazias.
  if (
    typeof mensagem !== "string" ||
    !mensagem.trim()
  ) {
    return res.status(400).json({
      erro: "Digite uma mensagem para a Nubi."
    });
  }

  // Evita mensagens excessivamente longas.
  if (mensagem.length > 1000) {
    return res.status(400).json({
      erro: "Mensagem muito longa. Envie até 1000 caracteres."
    });
  }

  // Identifica a conversa atual.
  const idSessao =
    typeof sessionId === "string" &&
    /^[a-zA-Z0-9_-]{1,100}$/.test(sessionId)
      ? sessionId
      : randomUUID();

  const historico = pegarHistorico(idSessao);
  const pergunta = mensagem.trim();

  // -----------------------------------------------
  // 6.1. PROTEÇÃO DE DISPONIBILIDADE
  // -----------------------------------------------

  const respostaConfirmada =
    respostaDeDisponibilidade(pergunta);

  if (respostaConfirmada) {
    guardarTroca(
      historico,
      pergunta,
      respostaConfirmada
    );

    return res.json({
      resposta: respostaConfirmada
    });
  }

  // -----------------------------------------------
  // 6.2. VERIFICAÇÃO DA CHAVE
  // -----------------------------------------------

  if (!ai) {
    return res.status(503).json({
      erro: "A Nubi ainda não foi configurada para acessar a IA."
    });
  }

  // -----------------------------------------------
  // 6.3. COMUNICAÇÃO REAL COM O GEMINI
  // -----------------------------------------------

  try {
    const conteudo = [
      ...historico,
      {
        role: "user",
        parts: [{ text: pergunta }]
      }
    ];

    const retorno = await ai.models.generateContent({
      model: MODELO,

      contents: conteudo,

      config: {
        systemInstruction: INSTRUCAO_DE_SISTEMA
      }
    });

    const resposta = retorno.text?.trim();

    if (!resposta) {
      return res.status(502).json({
        erro: "A Nubi não conseguiu gerar uma resposta agora."
      });
    }

    // Salva a conversa na memória.
    guardarTroca(
      historico,
      pergunta,
      resposta
    );

    // Envia a resposta ao chat do navegador.
    return res.json({
      resposta: resposta
    });

  } catch (erro) {

    // Verifica se o Gemini está sobrecarregado.
    const sobrecarga =
      erro?.status === 503 ||
      erro?.code === 503 ||
      String(erro?.message ?? "").includes('"code":503');

    console.error(
      "Falha na comunicação com Gemini. Status:",
      erro?.status ?? "desconhecido"
    );

    if (sobrecarga) {
      return res.status(503).json({
        erro:
          "A Nubi está temporariamente indisponível. " +
          "Tente novamente mais tarde."
      });
    }

    return res.status(500).json({
      erro: "Não foi possível falar com a Nubi agora."
    });
  }
});

// =====================================================
// 7. INICIAR O SERVIDOR
// =====================================================

const servidor = app.listen(PORTA, () => {
  console.log(
    `${PERSONA.empresa} no ar: http://localhost:${PORTA}`
  );

  console.log(
    `Atendente virtual: ${PERSONA.nome}`
  );

  console.log(
    `Modelo em uso: ${MODELO}`
  );

  console.log(
    "Versão: acesso a materiais ainda não disponíveis protegido."
  );
});

// Avisa quando outro servidor já ocupa a porta.
servidor.on("error", (erro) => {
  if (erro.code === "EADDRINUSE") {
    console.error(
      `A porta ${PORTA} já está sendo usada por outro servidor.`
    );
  } else {
    console.error(
      "Não foi possível iniciar o servidor:",
      erro.message
    );
  }

  process.exitCode = 1;
});
