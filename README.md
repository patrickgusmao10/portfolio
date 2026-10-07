# Patrick Gonçalves Gusmão — Portfolio

Versão de 7 de outubro de 2026, incluindo games favoritos, PSN, cinema, projetos e Tecnologias e competências. Inglês e português. HTML, CSS e JavaScript, sem build ou dependências.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub, por exemplo `portfolio`.
2. Extraia o ZIP e envie **o conteúdo** da pasta `patrick-portfolio` para a raiz do repositório. As pastas `dist` e `.github` devem ficar na raiz. Não deixe uma pasta `patrick-portfolio` envolvendo tudo dentro do repositório.
3. Abra **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Abra **Actions → Deploy portfolio to GitHub Pages → Run workflow**, selecione `main` e execute. Se a publicação automática já terminou com sucesso, não precisa repetir.
5. O endereço estará no resultado do workflow e em Settings → Pages. Para o repositório `portfolio`: https://patrickgusmao10.github.io/portfolio/.

Cada push em `main` publica a versão atual. A pasta `.github` é indispensável; certifique-se de incluí-la no upload.

### Pelo terminal

Dentro da pasta extraída:

```sh
git init
git add .
git commit -m "Publish personal portfolio"
git branch -M main
git remote add origin https://github.com/patrickgusmao10/portfolio.git
git push -u origin main
```

Troque `portfolio` pelo nome do seu repositório. Se o repositório já existe, copie estes arquivos para seu checkout e faça commit/push normalmente.

## Testar localmente

```sh
python -m http.server 8000 --directory dist
```

Abra http://localhost:8000. Para testar com um subdiretório, rode `python -m http.server 8000` e abra http://localhost:8000/dist/.

## Animações e segredo

Entrada ao rolar, inclinação dos projetos, luz de projetor e transições nativas entre páginas. Digite ↑ ↑ ↓ ↓ ← → ← → B A fora dos campos de texto para mostrar o personagem de Ponte dos Juros. Os efeitos respeitam movimento reduzido.

## Estrutura

- `dist/index.html`: portfólio
- `dist/games/index.html`: games favoritos
- `dist/cinema/index.html`: diário de cinema
- `dist/style.css`: visual e animações
- `dist/language.js`: traduções
- `dist/reviews.js`: críticas do Letterboxd
- `dist/motion.js`: animações e código Konami
- `dist/script.js`: interações
- `dist/images`: imagens e sprites
- `.github/workflows/deploy.yml`: publicação automática

Os caminhos são relativos e funcionam em um repositório comum ou na raiz `patrickgusmao10.github.io`. O formulário de contato abre o aplicativo de e-mail do visitante; não possui servidor de envio. A atualização do Letterboxd depende do serviço externo RSS2JSON e mantém as críticas de reserva quando ele não responde. As listas de favoritos são estáticas. O link PSN usa a página oficial da PlayStation e pode depender das configurações de privacidade. Nenhuma credencial ou configuração da hospedagem anterior está incluída.

Documentação: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
