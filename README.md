# projeto_desenvolvimento_web

Site da **Academia Bem-Estar** — projeto acadêmico da disciplina **SPODWE1 (BSI/IFSP)**.
O site é 100% front-end (HTML5, CSS3, JavaScript e Bootstrap), sem back-end e sem banco de dados.

## Modalidades

- Musculação (com seção de pré-avaliação em etapas)
- Luta — Taekwondo
- Dança — Fit Dance

## Funcionalidades em JavaScript

- Validação completa do formulário de cadastro, com mensagens de erro ao lado de cada campo.
- Mostrar/ocultar senha (com `aria-label` e suporte a teclado) e confirmação de senha.
- Atividades por checkboxes (ao menos uma obrigatória), planos com preços e total calculado em
  tempo real conforme o plano e a quantidade de atividades.
- Nível de experiência em cinco opções acessíveis (radios estilizados) e peso restrito a números.
- Resumo dos dados preenchidos exibido em um `<dialog>` ao enviar um formulário válido, sem senha.
- Home com planos gerados a partir do mesmo objeto `PLANOS` do cadastro. O botão de cada plano
  abre `cadastro.html?plano=...` e pré-seleciona o plano escolhido.
- Grade de horários montada via `fetch` a partir de `dados/tabela.json`, com agrupamento por
  horário, cores por modalidade e mensagem de erro caso o JSON não possa ser carregado.
- Se o AJAX for bloqueado (por exemplo, abrindo o site por `file://`), a grade usa uma cópia
  local de segurança embutida em `js/scripts.js` e avisa que os dados não foram atualizados.

## Estrutura do projeto

```
projeto_desenvolvimento_web/
├── index.html          Home: hero, modalidades, planos, benefícios e CT com áudio
├── musculacao.html     Descrição, índice, benefícios e stepper de pré-avaliação
├── luta.html           Descrição, benefícios, níveis/faixas e imagens
├── danca.html          Descrição, benefícios e imagens
├── horarios.html       Grade de aulas semanal (tabela preenchida via AJAX)
├── cadastro.html       Formulário geral de cadastro (meta G4)
├── css/
│   ├── bootstrap.min.css   Bootstrap 5.3.3 (local, sem CDN)
│   └── styles.css          CSS próprio (meta L3)
├── js/
│   ├── bootstrap.bundle.min.js  Bootstrap 5.3.3 (local, sem CDN)
│   └── scripts.js               Validação, diálogo de resumo e carga da tabela
├── dados/
│   └── tabela.json         Grade semanal consumida pelo fetch
├── img/                    Imagens do site
├── midia/                  Áudio/vídeo do site
└── docs/                   Documento do projeto (PDF)
```

## Como rodar

- **Basta abrir `index.html`** no navegador para navegar pelo site e testar o formulário.
- A grade de horários usa `fetch`, que é bloqueado quando a página é aberta direto por `file://`.
  Nesse caso a página mostra a versão local de segurança da grade. Para testar o AJAX de verdade,
  rode um servidor local na raiz do projeto (funciona também em qualquer hospedagem estática):

  ```
  python -m http.server 8000
  ```

  e acesse <http://localhost:8000>.

## Observações

- Nenhum CDN é usado: Bootstrap, imagens, áudio e fontes ficam locais, para o site funcionar
  **sem internet** na apresentação.
- Sem CSS ou JavaScript inline: todo estilo próprio vai em `css/styles.css` e todo script em
  `js/scripts.js`.
- A idade mínima usada na validação é **14 anos** (constante `IDADE_MINIMA` em `js/scripts.js`).
- As imagens e o áudio atuais são **placeholders** e devem ser substituídos pelos definitivos na meta L4.
