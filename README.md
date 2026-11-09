# projeto_desenvolvimento_web

Site da **Academia Bem-Estar** — projeto acadêmico da disciplina **SPODWE1 (BSI/IFSP)**.
O site é 100% front-end (HTML5, CSS3, JavaScript e Bootstrap), sem back-end e sem banco de dados.

## Modalidades

- Musculação (com aba de pré-avaliação com profissional)
- Luta — Taekwondo
- Dança — Fit Dance

## Funcionalidades em JavaScript

- Validação completa do formulário de cadastro, com mensagens de erro ao lado de cada campo.
- Resumo dos dados preenchidos exibido em um `<dialog>` ao enviar um formulário válido.
- Grade de horários montada via `fetch` a partir de `dados/tabela.json`, com agrupamento por
  horário, cores por modalidade e mensagem de erro caso o JSON não possa ser carregado.
- Se o AJAX for bloqueado (por exemplo, abrindo o site por `file://`), a grade usa uma cópia
  local de segurança embutida em `js/scripts.js` e avisa que os dados não foram atualizados.

## Estrutura do projeto

```
projeto_desenvolvimento_web/
├── index.html          Home: hero, cards das modalidades, áudio e chamada para cadastro
├── musculacao.html     Descrição e abas "Sobre" e "Pré-avaliação com profissional"
├── luta.html           Descrição, benefícios, níveis/faixas e imagens
├── danca.html          Descrição, benefícios e imagens
├── horarios.html       Grade de aulas semanal (tabela preenchida via AJAX)
├── cadastro.html       Formulário geral de cadastro (12 campos — meta G4)
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
