
# **RFC – Implementação do Projeto SPODWE1 (Website)**

**Autores:** Gabriel e Lucas E.  
**Grupo:** Gabriel, Lucas E., Vitor, Dennis e Ewerton  
**Disciplina:** SPODWE1 – BSI/IFSP  
**Status:** Em andamento (v2, domínio definido)  
**Atualizado em:** 17/10/2026

## **1\. Resumo**

O grupo vai construir o site de uma **academia com foco em bem-estar** (domínio sorteado: Aulas de Bem-Estar), com três modalidades: **Musculação**, **Luta** (Taekwondo) e **Dança** (Fit Dance). O site é 100% front-end (HTML5, CSS3, JavaScript e Bootstrap), sem back-end nem banco de dados. O trabalho tem duas fases: **Entrega Intermediária (20/10/2026)** e **Entrega Final (16/11/2026)**, com apresentação em 17/11/2026 às 7:55. Este RFC também serve de especificação para agentes de IA que forem programar ou revisar o código (seção 5).

## **2\. Decisões já tomadas pelo grupo**

Tiradas da conversa do grupo (2 e 17/10):

* **Tema:** site de academia, com aulas de musculação, luta e dança. Um único serviço por modalidade, para não inflar o projeto.  
* **Modalidades:** Musculação; Luta \= **Taekwondo** (consenso: “esse tem que ter”); Dança \= **Fit Dance** genérico (zumba como referência).  
* **Formulário:** **um único formulário geral de cadastro**, com lista para o usuário escolher a atividade. Sem campos específicos por modalidade.  
* **Musculação:** terá uma aba de **pré-avaliação com profissional**, para separar os tipos de aluno.  
* **Público-alvo:** amplo, sem faixa etária única. A faixa mínima ainda precisa ser fechada (seção 8).  
* **Repositório:** GitHub prometheu-z/projeto\_desenvolvimento\_web (estava vazio em 17/10). A entrega oficial continua sendo o zip no Moodle.

### **Documento de projeto: quem já assumiu o quê**

| Seção do documento | Responsável | Situação |
| :---- | :---- | :---- |
| Descrição do domínio de negócio | Ewerton | Assumido |
| Objetivo do website | Ewerton | Assumido |
| Descrição do público-alvo | Ewerton | Assumido |
| Diagrama de arquitetura da informação | Ewerton | Assumido (usar o mapa da seção 5.3 como base) |
| Referências externas | Vitor | Assumido |
| Protótipo da página inicial | Lucas (proposto) | Em aberto |
| Identidade visual (logo, cores, tipografia, formato das imagens) | Dennis | Em aberto |

O rascunho do documento está num Google Docs do grupo (compartilhado no chat em 16/10).

## **3\. Premissas e restrições**

* Grupo de 4 pessoas. As metas detalhadas abaixo são de **Gabriel** e **Lucas**; Vitor e Ewerton aparecem no que já assumiram e em sugestões de apoio.  
* Hoje é 17/10 e a intermediária vence em 20/10 às 23:59: **4 dias** corridos.  
* Entrega só pelo Moodle, em .zip ou .rar de até 10 MB (se passar, tirar áudio/vídeo e reduzir imagens). Só **um** integrante envia.  
* A apresentação deve funcionar **sem internet**: nada de CDN, Bootstrap e fontes ficam locais.  
* Apenas HTML, CSS e JavaScript. Único framework permitido: de estilização (Bootstrap).

## **4\. Objetivos e não-objetivos**

**Objetivos**

* Cumprir os 13 requisitos do enunciado.  
* Pontuar bem: implementação dos conceitos (4,0), organização do código (2,0), usabilidade (1,0), aparência (1,0), documento (1,0) e apresentação (1,0).  
* Código simples de entender e de manter, por humanos e por agentes de IA.

**Não-objetivos**

* Back-end, API própria, banco de dados, login real ou pagamento.  
* Qualquer framework que não seja de estilização (React, Vue, jQuery etc.).  
* Mais de uma modalidade por categoria (nada de várias lutas ou várias danças).

## **5\. Especificação técnica (para agentes de IA e para o grupo)**

### **5.1 Regras gerais para quem programa**

* Todo texto visível em **português do Brasil**. Comentários de código também.  
* **Sem CDN.** Bootstrap 5 (CSS e bundle JS) fica em css/ e js/. Fontes: pilha do sistema ou arquivos locais.  
* **Nenhum CSS ou JS inline.** Todo CSS próprio em css/styles.css; todo JS em js/scripts.js (nomes exatos exigidos pelo enunciado).  
* **HTML semântico:** header, nav, main, section, article, aside, figure/figcaption, footer, form, fieldset/legend, dialog. Usar div só quando não existir tag adequada.  
* IDs e classes próprias em kebab-case, sem acento (ex.: card-modalidade, corpo-tabela).  
* JavaScript puro (ES6+), sem bibliotecas. Funções pequenas, uma responsabilidade cada.  
* Toda img com alt descritivo e max-width: 100%.  
* Não criar arquivos fora da estrutura abaixo sem avisar o grupo.

### **5.2 Estrutura de pastas**

projeto\_desenvolvimento\_web/  
├── index.html  
├── musculacao.html  
├── luta.html  
├── danca.html  
├── horarios.html  
├── cadastro.html  
├── css/  
│   ├── bootstrap.min.css  
│   └── styles.css  
├── js/  
│   ├── bootstrap.bundle.min.js  
│   └── scripts.js  
├── dados/  
│   └── tabela.json            (fase final)  
├── img/  
├── midia/                     (vídeo ou áudio)  
└── docs/  
    └── documento-projeto.pdf  
As páginas ficam na **raiz** para simplificar caminhos relativos (o fetch do JSON usa dados/tabela.json).

### **5.3 Mapa de páginas (proposta para o diagrama do Ewerton)**

| Página | Arquivo | Conteúdo principal |
| :---- | :---- | :---- |
| Home Page | index.html | Hero, resumo das 3 modalidades (cards), vídeo/áudio, chamada para cadastro |
| Musculação | musculacao.html | Descrição, benefícios, abas Bootstrap: “Sobre” e “Pré-avaliação com profissional” |
| Luta (Taekwondo) | luta.html | Descrição, níveis, imagens |
| Dança (Fit Dance) | danca.html | Descrição, imagens, vídeo opcional |
| Horários | horarios.html | Tabela de grade de aulas (estática na intermediária, via AJAX na final) |
| Cadastro | cadastro.html | Formulário geral com escolha da atividade |

Todas as páginas compartilham a mesma navbar (links para as 6\) e o mesmo footer.

### **5.4 Esqueleto HTML padrão**

\<\!DOCTYPE html\>  
\<html lang="pt-BR"\>  
\<head\>  
  \<meta charset="UTF-8"\>  
  \<meta name="viewport" content="width=device-width, initial-scale=1"\>  
  \<title\>Nome da página | NOME DA ACADEMIA\</title\>  
  \<link rel="stylesheet" href="css/bootstrap.min.css"\>  
  \<link rel="stylesheet" href="css/styles.css"\>  
\</head\>  
\<body\>  
  \<header\>  
    \<nav class="navbar navbar-expand-lg" aria-label="Principal"\> ... \</nav\>  
  \</header\>  
  \<main\>  
    \<section\> ... \</section\>  
  \</main\>  
  \<footer\> ... \</footer\>  
  \<script src="js/bootstrap.bundle.min.js"\>\</script\>  
  \<script src="js/scripts.js"\>\</script\>  
\</body\>  
\</html\>

### **5.5 Formulário de cadastro (cadastro.html)**

Formulário id="form-cadastro" com novalidate (a validação é feita por JS). Mínimo exigido: 8 tipos diferentes; o plano usa 11\.

| Campo (name) | Tipo | Regra de validação em JS |
| :---- | :---- | :---- |
| nome | text | Obrigatório, mínimo 2 palavras, 3+ caracteres |
| email | email | Obrigatório, formato válido |
| telefone | tel | Obrigatório, 10 ou 11 dígitos |
| nascimento | date | Obrigatório, não pode ser futura, idade mínima conforme decisão da seção 8 |
| senha | password | Mínimo 8 caracteres, com letra e número |
| atividade | select | Obrigatório (Musculação, Taekwondo, Fit Dance) |
| plano | radio | Obrigatório (Mensal, Trimestral, Anual) |
| horarios | checkbox (grupo) | Pelo menos 1 período (manhã, tarde, noite) |
| experiencia | range | 1 a 5, sempre válido, exibido no resumo |
| peso | number | Opcional; se preenchido, entre 30 e 300 |
| observacoes | textarea | Opcional, até 300 caracteres |
| termos | checkbox | Obrigatório estar marcado |

Comportamento ao enviar: preventDefault, validar tudo, mostrar erros ao lado de cada campo (classes is-invalid e is-valid do Bootstrap); se tudo válido, abrir um \<dialog id="dialogo-resumo"\> listando os dados preenchidos. Nada é enviado a servidor.

### **5.6 Tabela de horários (horarios.html)**

Layout: **grade semanal** — os **dias** ficam nas colunas e os **horários** nas linhas; cada célula mostra um "card" de aula com modalidade, nível e professor. Estrutura: table com caption, thead e **tbody id="corpo-tabela"**.

* **Intermediária:** linhas escritas direto no HTML.  
* **Final:** tbody vazio, preenchido por fetch("dados/tabela.json") quando a página carrega; o JavaScript agrupa a lista por horário para montar a matriz.  

Formato do dados/tabela.json (lista de objetos, chaves em minúsculas e sem acento):

\[  
  { "dia": "Segunda", "horario": "07:00", "modalidade": "Musculação", "professor": "A definir", "nivel": "Todos" },  
  { "dia": "Terça", "horario": "19:00", "modalidade": "Taekwondo", "professor": "A definir", "nivel": "Iniciante" }  
\]

### **5.7 Regras de CSS próprias (css/styles.css, meta: 20, mínimo exigido: 15\)**

| \# | Seletor | Tipo | Para quê |
| :---- | :---- | :---- | :---- |
| 1 | :root (variáveis de cor e fonte) | pseudoclasse | Tokens da identidade visual |
| 2 | body | simples | Fonte base e cor de fundo |
| 3 | h1, h2, h3 | agrupado | Fonte e cor dos títulos |
| 4 | header nav a:hover | composto \+ pseudoclasse | Destaque dos links do menu |
| 5 | .card-modalidade:hover | pseudoclasse | Elevação do card |
| 6 | .card-modalidade img | composto | Altura fixa e object-fit |
| 7 | main \> section | composto (filho) | Espaçamento entre seções |
| 8 | section h2::after | pseudoelemento | Traço decorativo sob o título |
| 9 | blockquote::before | pseudoelemento | Aspas decorativas em depoimentos |
| 10 | p::first-letter | pseudoelemento | Letra capitular no texto de abertura |
| 11 | tbody tr:nth-child(even) | pseudoclasse | Zebra na tabela |
| 12 | table caption | composto | Estilo da legenda |
| 13 | form input:focus, form select:focus | composto \+ pseudoclasse | Foco visível |
| 14 | .msg-erro | simples | Texto de erro de validação |
| 15 | .btn-principal | simples | Botão de ação principal |
| 16 | .hero | simples | Fundo e altura do topo da home |
| 17 | footer a | composto | Links do rodapé |
| 18 | figure figcaption | composto | Legenda de imagens |
| 19 | dialog::backdrop | pseudoelemento | Fundo do diálogo de resumo |
| 20 | @media (max-width: 576px) .hero | simples em media query | Ajuste do hero no celular |

O requisito de 2 compostos, 2 pseudoclasses e 2 pseudoelementos já está coberto várias vezes.

### **5.8 Contrato do js/scripts.js**

| Função | O que faz |
| :---- | :---- |
| validarFormulario(evento) | Handler do submit; chama as validações e decide se abre o diálogo |
| validarNome, validarEmail, validarTelefone, validarNascimento, validarSenha, validarAtividade, validarPlano, validarHorarios, validarPeso, validarObservacoes, validarTermos | Cada uma recebe o valor e devolve { valido, mensagem } |
| mostrarErro(campo, mensagem) / limparErro(campo) | Aplicam e removem is-invalid/is-valid e a .msg-erro |
| exibirResumo(dados) | Monta a lista de dados no \<dialog\> e chama showModal() |
| carregarTabela() | fetch de dados/tabela.json; chama renderizarTabela; trata erro com mensagem na tela |
| renderizarTabela(linhas) | Cria as tr/td dentro de \#corpo-tabela |

Os addEventListener são registrados dentro de DOMContentLoaded. Cada função só toca no que o nome diz.

### **5.9 Identidade visual (a fechar pelo Dennis)**

* Variáveis em :root: \--cor-primaria, \--cor-secundaria, \--cor-fundo, \--cor-texto, \--cor-destaque, \--fonte-titulo, \--fonte-texto.  
* Tipografia a documentar no PDF: família e tamanho de h1–h6, p, nav, header, footer.  
* Imagens: JPG para fotos, PNG para logo e ícones, GIF só se houver animação curta. Todas leves (alvo: zip final abaixo de 10 MB).  
* Mínimo de **5 imagens** e **1 vídeo ou áudio** (\<video controls\> ou \<audio controls\>, com \<source\> e texto alternativo).

### **5.10 Como rodar e validar**

* Abrir index.html direto no navegador funciona para tudo, **menos o fetch do JSON** (bloqueado em file://).  
* Para testar a fase final: na raiz do projeto, python \-m http.server 8000 e abrir http\://localhost:8000.  
* Antes de entregar: validar o HTML (validador W3C), conferir o console do navegador sem erros e testar em 360px, 768px, 1024px e 1440px.

# **FASE 1 – Entrega Intermediária (até 20/10/2026, 23:59)**

**Escopo:** requisitos 1 a 10, **exceto** a implementação de JavaScript: documento de projeto, HTML, CSS, framework, imagens, vídeo/áudio, formulário (só a estrutura HTML), tabela estática e styles.css.

## **1.1 Metas do Gabriel**

* ☐ **G1.** Subir o esqueleto no repositório (hoje está vazio): pastas da seção 5.2, Bootstrap local, .gitignore, README curto.  
* ☐ **G2.** Criar o esqueleto das 6 páginas, todas com a mesma navbar e o mesmo footer (seção 5.4), para o Lucas poder estilizar em paralelo.  
* ☐ **G3.** Preencher o HTML semântico de index.html, musculacao.html (com abas “Sobre” e “Pré-avaliação”), luta.html e danca.html.  
* ☐ **G4.** Montar cadastro.html com os 12 campos da seção 5.5 (estrutura, label, fieldset, atributos HTML5; sem JS ainda) e o \<dialog\> vazio.  
* ☐ **G5.** Conferir links entre páginas, semântica (sem div solto) e ausência de CSS/JS inline.  
* ☐ **G6.** Revisar o PDF do documento e montar o zip ProjetoIntDWE1\_… (nomes dos 4 em ordem alfabética); enviar no Moodle.

## **1.2 Metas do Lucas**

* ☐ **L1.** Definir a identidade visual: logo, paleta, tipografia, formato das imagens (seção 5.9, ver com o dennis).  
* ☐ **L2.** Fazer o protótipo da página inicial (wireframe ou mockup).  
* ☐ **L3.** Escrever styles.css com 20 regras (tabela 5.7), cobrindo os tipos de seletor exigidos.  
* ☐ **L4.** Reunir e otimizar 5+ imagens e 1 vídeo ou áudio; colocar em img/ e midia/.  
* ☐ **L5.** Montar a tabela estática em horarios.html (seção 5.6), com Bootstrap \+ CSS próprio.  
* ☐ **L6.** Consolidar o **PDF do documento (5 a 10 páginas)**: partes do Ewerton, dennis e do Vitor \+ protótipo \+ identidade visual.  
* ☐ **L7.** Escrever os textos das páginas.

## **1.3 Apoio sugerido (Ewerton e Vitor)**

Sugestão, a confirmar com eles: **Vitor** entrega a parte dele do documento e ajuda no HTML de luta.html e danca.html; **Ewerton** entrega as referências externas e revisa o documento e os textos.

## **1.4 Cronograma da Fase 1**

| Dia | Gabriel | Lucas |
| :---- | :---- | :---- |
| **Sáb 17/10** | G1, G2 | L1, L2 |
| **Dom 18/10** | G3, G5 (parcial) | L3 (primeira versão), L4, L5 |
| **Seg 19/10** | G4, G5 | L3 (ajustes), L6, L7 |
| **Ter 20/10** | Revisão cruzada, G6 (envio com folga, **meta: até 20h**) | Revisão cruzada, exportar PDF final |

## **1.5 Critérios de aceite da Fase 1**

* Todas as páginas abrem sem erro e navegam entre si.  
* styles.css com 15+ regras e os tipos de seletor exigidos.  
* Formulário com 8+ tipos de componente diferentes.  
* 5+ imagens e 1 vídeo ou áudio funcionando.  
* Tabela estática presente.  
* PDF com 5 a 10 páginas e todas as seções pedidas.  
* Zip com nome correto e menor que 10 MB.

## **1.6 Riscos da Fase 1**

| Risco | Mitigação |
| :---- | :---- |
| Prazo de 4 dias | Fazer primeiro os requisitos obrigatórios; detalhe visual depois |
| Repositório vazio e 4 pessoas mexendo | G1 e G2 saem hoje; cada um trabalha em arquivos diferentes |
| Zip acima de 10 MB | Comprimir imagens desde o início; vídeo curto |
| Itens do documento ainda em aberto | Lucas assume protótipo e identidade; cobrar Ewerton e Vitor até domingo |
| Nome do zip errado | Conferir ordem alfabética e sobrenomes antes de enviar |

# **FASE 2 – Entrega Final (até 16/11/2026, 23:59)**

**Escopo:** tudo da intermediária \+ JavaScript (scripts.js), validação do formulário, AJAX com tabela.json, responsividade, ajustes do feedback e preparo da apresentação (17/11, 7:55).

## **2.1 Metas do Gabriel**

* ☐ **G7.** Implementar as validações da seção 5.5/5.8 em scripts.js, com mensagens claras.  
* ☐ **G8.** Implementar exibirResumo: ao enviar um formulário válido, abrir o \<dialog\> com os dados preenchidos.  
* ☐ **G9.** Criar dados/tabela.json (com conteúdo do Lucas) e carregarTabela com fetch, rodando ao carregar a página, com tratamento de erro.  
* ☐ **G10.** Testar o AJAX com servidor local e combinar com o professor como rodar na apresentação sem internet.  
* ☐ **G11.** Organizar o código (funções pequenas, nomes claros, comentários em português).

## **2.2 Metas do Lucas**

* ☐ **L8.** Layout fluido e responsivo (360, 768, 1024 e 1440 px), sem rolagem horizontal indevida.  
* ☐ **L9.** Polir usabilidade e aparência: contraste, espaçamentos, foco e feedback visual de erro/sucesso na validação.  
* ☐ **L10.** Fornecer o conteúdo do tabela.json e ajustar o CSS da tabela para linhas geradas por JS.  
* ☐ **L11.** Atualizar o documento de projeto com o resultado final.  
* ☐ **L12.** Montar o roteiro da apresentação de 15 minutos: documento, navegação, código, perguntas.  
* ☐ **L13.** Testar em Chrome, Firefox e celular.

## **2.3 Cronograma da Fase 2**

| Período | Gabriel | Lucas |
| :---- | :---- | :---- |
| **21 a 24/10** | Ler feedback da intermediária; G7 | Corrigir pendências; L8 |
| **25/10 a 1/11** | G8, G9 | L9, L10 |
| **2 a 8/11** | G10, G11 | L11, L13 |
| **9 a 13/11** | Revisão cruzada e testes offline | Revisão cruzada e L12 |
| **14 e 15/11** | Ensaio cronometrado, congelar a versão | Ensaio, gerar o zip ProjetoFinalDWE1\_… |
| **Seg 16/11** | Envio no Moodle (**meta: até 18h**) | Conferir envio e nome do arquivo |
| **Ter 17/11** | **Apresentação às 7:55** | **Apresentação às 7:55** |

## **2.4 Critérios de aceite da Fase 2**

* Formulário validado só por funções em scripts.js; envio válido mostra os dados num diálogo.  
* Tabela preenchida por AJAX a partir de tabela.json assim que a página carrega.  
* Site funciona **sem internet**.  
* Layout responsivo nos 4 tamanhos testados.  
* Código organizado, comentado e sem trechos mortos.  
* Zip ProjetoFinalDWE1\_… correto e menor que 10 MB.  
* Os 4 integrantes presentes desde o início da apresentação (atraso custa 3,0 pontos; ausência custa metade da nota).

## **2.5 Riscos da Fase 2**

| Risco | Mitigação |
| :---- | :---- |
| fetch bloqueado em file:// | Testar com python \-m http.server; alinhar com o professor |
| Campus sem internet | Tudo local (Bootstrap, fontes, mídia) |
| Atraso ou ausência na apresentação | Chegar antes das 7:55; a ordem não muda no dia |
| Entrega perto do prazo | Enviar com horas de folga; sem entrega no prazo, a nota é zero |

## **6\. Fluxo de trabalho**

1. Branches por pessoa (gabriel/…, lucas/…) e merge na main depois que o outro revisar.  
2. Commits pequenos, mensagem clara em português.  
3. Conversa rápida diária para alinhar bloqueios, incluindo Vitor e Ewerton.  
4. Antes de cada entrega, passar o checklist da fase.  
5. Agentes de IA seguem a seção 5 e não mexem em arquivos de outra pessoa sem pedido explícito.

## **7\. Questões em aberto**

| Pergunta | Quem decide | Observação |
| :---- | :---- | :---- |
| Faixa etária mínima do público (14+, 18+, sem limite) | Grupo (Ewerton escreve o público-alvo) | Gabriel citou 14+; Lucas defendeu não restringir |
| Luta: só Taekwondo ou mais uma (Boxe ou Jiu-jitsu) | Grupo | Hoje o plano usa só Taekwondo |
| Nome da academia e logo | Lucas | Usado como NOME DA ACADEMIA nos exemplos |
| Sobrenomes para o nome do zip | Todos | Formato NomeSobrenome, ordem alfabética |
| Quem faz o protótipo e a identidade visual | Grupo | Proposto: Lucas |
| Uso do ficalog.net/academia (referência ou hospedagem) | Gabriel e Vitor | Mencionado no chat; não afeta a entrega por zip |
| Vídeo ou áudio | Lucas | Vídeo curto é mais fácil de justificar na home |

## **8\. Checklist final de requisitos do enunciado**

* ☐ Sem back-end e sem banco de dados  
* ☐ Documento PDF (5 a 10 páginas) com Concepção, Arquitetura da Informação e Identidade Visual  
* ☐ Apenas HTML, CSS e JavaScript  
* ☐ Bootstrap como único framework (de estilização)  
* ☐ Tags semânticas do HTML5, sem div indiscriminado  
* ☐ 1 áudio ou vídeo e 5+ imagens  
* ☐ Formulário com 8+ tipos de componente, validado em JS, com exibição dos dados em diálogo  
* ☐ Tabela estática (intermediária) e depois via AJAX com tabela.json (final)  
* ☐ 15+ regras CSS próprias (2 compostos, 2 pseudoclasses, 2 pseudoelementos) em styles.css  
* ☐ Funções JS em scripts.js  
* ☐ Layout fluido e responsivo  
* ☐ Zips nomeados corretamente e enviados pelo Moodle4

