# Infinity Maker Backend

Servidor backend para o aplicativo Infinity Maker, que processa uploads de imagens e se comunica com a API do Infinity Maker.

## Instalação

1. Clone este repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor:
   ```
   npm start
   ```
   
Para desenvolvimento, use:
```
npm run dev
```

## Endpoints

### POST /api/infinity-maker

Processa uma imagem e aplica transformações baseadas nos parâmetros escolhidos.

#### Parâmetros
- `photo`: Arquivo de imagem (obrigatório)
- `base`: Base temática (obrigatório)
- `acessorio`: Acessório para adicionar (obrigatório)

#### Resposta
```json
{
  "urlImagem": "https://url-da-imagem-processada.com/imagem.jpg"
}
```