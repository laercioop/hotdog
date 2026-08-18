# Campanha Hotdog ASJ

Dashboard estático da campanha de arrecadação para a Festa de São Pio X.

## Publicação no GitHub Pages

1. Envie todos os arquivos deste diretório para um repositório no GitHub.
2. No repositório, abra `Settings` > `Pages`.
3. Em **Build and deployment**, selecione **Deploy from a branch**, a branch `main` e a pasta `/(root)`.
4. O dashboard ficará no endereço informado pelo GitHub. O gerador fica em `.../gerador.html`.

## Atualização dos dados

1. No Windows, dê dois cliques em `iniciar-gerador.bat` para abrir o gerador localmente. Também é possível abrir `gerador.html` pelo site publicado no GitHub Pages.
2. Informe a meta, o valor arrecadado, o número de doadores, a data e a mensagem.
3. Baixe o novo `app.js`.
4. Substitua o `app.js` no repositório e envie a alteração ao GitHub. O GitHub Pages atualiza o dashboard em seguida.

O mural exibe um hotdog para cada R$ 1,00 arrecadado.

## Captura da página

Dê dois cliques em `captura.bat`. O arquivo PNG será criado dentro da pasta `capturas`, no tamanho 1366 × 608, com a data e a hora no nome.
