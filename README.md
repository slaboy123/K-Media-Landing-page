# K-Media Landing Page

Landing page institucional da K-Media, focada em apresentar servicos, portfolio, equipe, processo comercial e depoimentos, com visual premium e foco em conversao para WhatsApp.

## Visao geral

Este projeto e um site estatico com:

- Hero com chamada principal e CTA para WhatsApp
- Secao de servicos com links diretos de contato
- Carrossel de projetos (portfolio)
- Secao de equipe
- Fluxo "Como Funciona"
- Slider de depoimentos
- Animacoes de entrada e efeitos de parallax (com respeito a `prefers-reduced-motion`)

## Tecnologias

- HTML5
- SCSS (arquivo fonte)
- CSS compilado
- JavaScript vanilla
- Node.js (para gerenciar dependencias)
- Sass (dev dependency) para gerar o CSS a partir do SCSS

## Estrutura de arquivos

- `index.html`: estrutura da pagina
- `style.scss`: estilos fonte (editar aqui)
- `style.css`: CSS compilado usado pela pagina
- `style.css.map`: source map do CSS
- `script.js`: interacoes (menu mobile, reveal, carrossel, slider, parallax)
- `package.json`: metadados e dependencias do projeto

## Como executar localmente

### 1. Instalar dependencias

```bash
npm install
```

### 2. Rodar o projeto

Como o projeto e estatico, voce pode abrir o `index.html` direto no navegador.

Opcao recomendada (servidor local):

- Use a extensao Live Server no VS Code
- Clique com o botao direito em `index.html`
- Selecione "Open with Live Server"

## Fluxo de edicao de estilos

1. Edite o arquivo `style.scss`
2. Gere/atualize o `style.css`
3. Recarregue o navegador

Se quiser compilar SCSS por linha de comando:

```bash
npx sass style.scss style.css --watch
```

## Responsividade e UX

- Layout adaptado para desktop e mobile
- Menu mobile com toggle
- Navegacao com fechamento automatico ao clicar em links
- Suporte a usuarios com reducao de movimento

## Deploy

Por ser um projeto estatico, pode ser publicado facilmente em:

- GitHub Pages
- Netlify
- Vercel (modo estatico)

### Deploy na Vercel

- O projeto ja esta preparado com `index.html` em lowercase (importante para ambiente Linux)
- O arquivo `vercel.json` adiciona redirect de `/Index.html` para `/` e cabecalhos basicos de seguranca
- Para publicar, basta importar o repositorio na Vercel e usar as configuracoes padrao

## Melhorias sugeridas

- Adicionar scripts npm (`dev`, `build`, `watch:sass`) no `package.json`
- Incluir `.gitignore` (ex.: ignorar `node_modules`)
- Trocar imagens externas por assets otimizados locais
- Adicionar metodos de analytics (GA4, Pixel, etc.)

## Licenca

Uso interno da K-Media. Ajuste esta secao caso queira definir uma licenca publica.
