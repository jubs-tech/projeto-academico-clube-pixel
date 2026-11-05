# Clube Pixel — Seu Clube de Estudos

Projeto acadêmico desenvolvido para a disciplina **Desenvolvimento Web para IA**. O Clube Pixel apresenta a proposta de um clube de estudos com materiais educativos e ferramentas online para ajudar estudantes a organizar sua rotina.

A interface utiliza uma identidade visual inspirada em pixel art e inclui uma atendente virtual chamada **Nubi**, integrada à API do Google Gemini por meio de um servidor Node.js.

## Integrantes

- **Amanda Araújo**
- **Júlia Samara**
- **Laysa Millena**

## Tecnologias utilizadas

- **HTML5:** estrutura e conteúdo da página.
- **CSS3:** identidade visual, layout, responsividade e estados interativos.
- **JavaScript:** validação demonstrativa do formulário, destaque da navegação e interação com o chat.
- **Node.js e Express:** servidor que disponibiliza o site e a rota de atendimento.
- **Google Gemini (`@google/genai`):** geração de respostas da Nubi.
- **dotenv:** leitura da chave de API a partir de variável de ambiente.
- **Git e GitHub:** versionamento e colaboração.

## Funcionalidades atuais

- Navegação entre as seções **Início**, **Benefícios**, **Planos** e **Contato**.
- Apresentação de três benefícios planejados: materiais digitais, planejador de estudos e checklist de tarefas.
- Cards com as propostas de **Plano gratuito (R$ 0)** e **Pixel Premium (R$ 19,90 por mês)**.
- Estilo visual pixelado, ajustes responsivos e destaque do item de menu conforme a seção visualizada.
- **Formulário demonstrativo** que valida nome, e-mail e mensagem e sinaliza campos inválidos. **Não há envio real de mensagens.**
- **Chat da Nubi** com abertura e fechamento, envio pelo botão ou pela tecla Enter, fechamento pela tecla Esc e exibição de mensagens.
- Integração da Nubi com a API Gemini por meio da rota `POST /api/chat`, com persona e informações específicas do Clube Pixel.

### O que ainda está planejado

O site apresenta uma proposta de produto. **Os materiais e as ferramentas de estudo ainda não estão disponíveis para uso.** Também não foram implementados cadastro e login de usuários, contratação de assinatura ou cobrança real. Os preços exibidos são propostas, e o formulário de contato não envia dados para uma equipe.

## Requisitos para executar

- **Node.js** e **npm** instalados.
- Conexão com a internet para utilizar a API Gemini.
- Uma **chave de API válida do Google Gemini** para obter respostas geradas por IA.

## Instalação e execução

1. Clone o repositório ou abra a pasta do projeto:

   ```bash
   git clone https://github.com/jubs-tech/clube-pixel.git
   cd clube-pixel
   ```

2. Instale as dependências registradas no `package-lock.json`:

   ```bash
   npm ci
   ```

   Se o PowerShell do Windows bloquear o comando `npm`, utilize `npm.cmd ci`.

3. Crie um arquivo chamado **`.env`** na raiz do projeto, ao lado do `server.js`, com a seguinte variável:

   ```dotenv
   GEMINI_API_KEY=SUA_CHAVE_DO_GEMINI
   ```

   Substitua o texto de exemplo pela sua chave. **Não coloque a chave no HTML ou no JavaScript público e nunca publique o arquivo `.env` no GitHub.** O `.gitignore` já prevê a exclusão desse arquivo.

4. Inicie o servidor na raiz do projeto:

   ```bash
   node server.js
   ```

5. Abra **http://localhost:3000** no navegador.

Para encerrar o servidor, pressione **Ctrl + C** no terminal em que ele está rodando.

> O projeto não possui um script `npm start` configurado no `package.json`; por isso, a inicialização é feita diretamente com `node server.js`.

## Como funciona a Nubi

1. O estudante digita uma mensagem no chat da página.
2. O JavaScript envia uma requisição `POST /api/chat` para o servidor Express, incluindo a mensagem e um identificador da conversa.
3. O servidor utiliza a persona de `persona.js` e o contexto do Clube Pixel para orientar a resposta. Para perguntas sobre disponibilidade dos planos e materiais, ele também utiliza verificações específicas para não anunciar recursos ainda inexistentes.
4. Quando aplicável, o servidor consulta o **Google Gemini** usando a chave armazenada no ambiente do servidor.
5. A resposta retorna em JSON e é exibida na interface.

O histórico recente de cada conversa fica temporariamente **na memória do servidor**; ele não equivale a uma conta de usuário ou a um armazenamento permanente. Sem uma chave válida ou em caso de indisponibilidade da API, a geração de respostas por IA não funciona normalmente.

## Estrutura dos arquivos

```text
clube-pixel/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── server.js                 # Servidor Express e integração com Gemini
├── persona.js                # Identidade e conhecimento da Nubi
└── public/
    ├── index.html            # Conteúdo e estrutura da página
    ├── css/
    │   └── style.css         # Identidade visual e responsividade
    ├── js/
    │   └── script.js         # Formulário, menu e chat
    └── imagens/
        ├── logo-clube-pixel.webp
        ├── favicon.ico
        ├── icones/            # Ícones SVG
        └── ilustracoes/      # Ilustrações SVG
```

O arquivo `.env` é criado localmente durante a configuração e **não deve ser versionado**. A pasta `node_modules/` também não é incluída no repositório.

## Verificação manual

Depois de iniciar o servidor, confira:

1. Se a página abre em `http://localhost:3000`.
2. Se as quatro opções do menu levam às seções corretas.
3. Se os cards, o formulário e a Nubi se ajustam às telas de computador e celular.
4. Se o formulário indica campos vazios ou inválidos e informa que o envio é demonstrativo.
5. Se o chat abre e fecha corretamente e permite enviar mensagens com Enter.
6. Se a Nubi responde a uma pergunta sobre organização dos estudos usando a conexão real com Gemini.
7. Se ela explica corretamente que materiais, assinatura e cobrança ainda não estão disponíveis.

Para verificar apenas a sintaxe do JavaScript, é possível executar na raiz do projeto:

```bash
node --check public/js/script.js
```

**Observação:** essa conferência de sintaxe não substitui os testes de funcionamento no navegador nem valida a conexão com a API.

## Repositório

https://github.com/jubs-tech/clube-pixel
