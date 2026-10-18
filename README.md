# projeto_desenvolvimento_web

Site da **Academia Bem-Estar** — projeto acadêmico da disciplina **SPODWE1 (BSI/IFSP)**.
O site é 100% front-end (HTML5, CSS3, JavaScript e Bootstrap), sem back-end e sem banco de dados.

## Modalidades

- Musculação (com aba de pré-avaliação com profissional)
- Luta — Taekwondo
- Dança — Fit Dance

## Estrutura do projeto

```
projeto_desenvolvimento_web/
├── index.html          Home: hero, cards das modalidades, áudio e chamada para cadastro
├── musculacao.html     Descrição e abas "Sobre" e "Pré-avaliação com profissional"
├── luta.html           Descrição, benefícios, níveis/faixas e imagens
├── danca.html          Descrição, benefícios e imagens
├── horarios.html       Grade de aulas (em construção — meta L5)
├── cadastro.html       Formulário geral de cadastro (em construção — meta G4)
├── css/
│   ├── bootstrap.min.css   Bootstrap 5.3.3 (local, sem CDN)
│   └── styles.css          CSS próprio (meta L3)
├── js/
│   ├── bootstrap.bundle.min.js  Bootstrap 5.3.3 (local, sem CDN)
│   └── scripts.js               JS próprio (Fase 2)
├── dados/              tabela.json (Fase 2)
├── img/                Imagens do site
├── midia/              Áudio/vídeo do site
└── docs/               Documento do projeto (PDF)
```

## Como rodar

- **Basta abrir `index.html`** no navegador para navegar pelo site.
- Para testar o carregamento do JSON da tabela (Fase 2), use um servidor local na raiz do projeto:

  ```
  python -m http.server 8000
  ```

  e acesse <http://localhost:8000>.

## Observações

- Nenhum CDN é usado: Bootstrap, imagens, áudio e fontes ficam locais, para o site funcionar **sem internet** na apresentação.
- Sem CSS ou JavaScript inline: todo estilo próprio vai em `css/styles.css` e todo script em `js/scripts.js`.
- As imagens e o áudio atuais são **placeholders** e devem ser substituídos pelos definitivos na meta L4.
