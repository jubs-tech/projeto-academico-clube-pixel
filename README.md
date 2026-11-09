# Clube Pixel — Seu Clube de Estudos

Projeto acadêmico desenvolvido para a disciplina **Desenvolvimento Web para IA**. O Clube Pixel apresenta a proposta de um clube de estudos com materiais educativos e ferramentas online para ajudar estudantes a organizar sua rotina.

A interface utiliza uma identidade visual inspirada em pixel art e inclui uma atendente virtual chamada **Nubi**, integrada à API do Google Gemini por meio de um servidor Node.js.

## Integrantes

- **Amanda Araújo**
- **Júlia Samara**
- **Laysa Millena**

## Tecnologias utilizadas

- **HTML5:** estrutura e conteúdo da página.
- **CSS3:** identidade visual, layout, Flexbox, responsividade e estados interativos.
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
- Menu adaptado para celulares, com botão de abertura e fechamento.
- **Formulário demonstrativo** que valida nome, e-mail e mensagem e sinaliza campos inválidos. **Não há envio real de mensagens.**
- **Chat da Nubi** com abertura e fechamento, envio pelo botão ou pela tecla Enter, fechamento pela tecla Esc e exibição de mensagens.
- Ajuste do chat ao teclado virtual em dispositivos móveis utilizando `visualViewport`, sem abrir o teclado automaticamente quando o chat é exibido em aparelhos de toque.
- Saudação inicial da Nubi exibida na interface; a persona orienta a IA a **não repetir essa apresentação** quando responder às perguntas do estudante.
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
   git clone https://github.com/jubs-tech/projeto-academico-clube-pixel.git
   cd projeto-academico-clube-pixel
   ```

2. Instale as dependências registradas no `package-lock.json`:

   ```bash
   npm ci
   ```

   Se o PowerShell do Windows bloquear o comando `npm`, utilize `npm.cmd ci`.

3. Crie seu arquivo de configuração a partir do **`.env.example`**, na raiz do projeto, ao lado do `server.js`.

   No PowerShell do Windows:

   ```powershell
   Copy-Item .env.example .env
   ```

   Em seguida, abra o `.env` e substitua o valor de exemplo pela **sua chave real do Google Gemini**:

   ```dotenv
   GEMINI_API_KEY=SUA_CHAVE_REAL_AQUI
   ```

   **Segurança:** o `.env.example` contém somente um valor fictício e pode ser enviado ao GitHub. O `.env` contém a chave real, é exclusivamente local e **nunca deve ser publicado nem incluído em commits**. O `.gitignore` já bloqueia o `.env` e permite o `.env.example`. Se o arquivo `.env.example` ainda não estiver no projeto, adicione-o antes de seguir estas instruções.

4. Inicie o servidor na raiz do projeto:

   ```bash
   node server.js
   ```

5. Abra **http://localhost:3000** no navegador.

Para encerrar o servidor, pressione **Ctrl + C** no terminal em que ele está rodando.

> O projeto não possui um script `npm start` configurado no `package.json`; por isso, a inicialização é feita diretamente com `node server.js`.

## Como funciona a Nubi

1. A interface mostra uma saudação inicial da Nubi, definida em `public/index.html`.
2. O estudante digita uma mensagem no chat da página.
3. O JavaScript envia uma requisição `POST /api/chat` para o servidor Express, incluindo a mensagem e um identificador da conversa.
4. O servidor utiliza a persona de `persona.js` e o contexto do Clube Pixel para orientar a resposta. Para perguntas sobre disponibilidade dos planos e materiais, ele também utiliza verificações específicas para não anunciar recursos ainda inexistentes.
5. Quando aplicável, o servidor consulta o **Google Gemini** usando a chave armazenada no ambiente do servidor.
6. A resposta retorna em JSON e é exibida na interface. A persona orienta a Nubi a responder diretamente, sem repetir a saudação exibida na abertura do chat.

O histórico recente de cada conversa fica temporariamente **na memória do servidor**; ele não equivale a uma conta de usuário ou a um armazenamento permanente. Sem uma chave válida ou em caso de indisponibilidade da API, a geração de respostas por IA não funciona normalmente.

## Estrutura dos arquivos

```text
projeto-academico-clube-pixel/
├── .gitignore
├── .env.example             # Modelo público, sem chaves reais
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

O arquivo `.env` é criado localmente a partir do `.env.example` e **não deve ser versionado**. A pasta `node_modules/` também não é incluída no repositório.

## Verificação manual

O grupo informou que realizou os testes manuais de navegação, responsividade, formulário e comunicação da Nubi com a IA. Entre os testes relatados está uma resposta contextualizada do Gemini a uma pergunta sobre como organizar duas horas de estudo entre Matemática, História e Português.

Para reproduzir as verificações depois de iniciar o servidor, confira:

1. Se a página abre em `http://localhost:3000`.
2. Se as quatro opções do menu levam às seções corretas.
3. Se os cards, o formulário e a Nubi se ajustam às telas de computador e celular.
4. Se o formulário indica campos vazios ou inválidos e informa que o envio é demonstrativo.
5. Se o chat abre e fecha corretamente e permite enviar mensagens com Enter.
6. Se, no celular, o teclado virtual não encobre o campo de digitação nem o botão Enviar.
7. Se a Nubi responde a uma pergunta sobre organização dos estudos usando a conexão real com Gemini.
8. Se ela explica corretamente que materiais, assinatura e cobrança ainda não estão disponíveis.
9. Após qualquer alteração na persona, se a Nubi responde **sem repetir a saudação inicial** que já aparece no chat.

Para verificar apenas a sintaxe do JavaScript, é possível executar na raiz do projeto:

```bash
node --check public/js/script.js
node --check persona.js
node --check server.js
```

**Observação:** essa conferência de sintaxe não substitui os testes de funcionamento no navegador nem valida a conexão com a API. O novo ajuste da orientação de saudação deve ser retestado depois de aplicado.

## Repositório

https://github.com/jubs-tech/projeto-academico-clube-pixel
