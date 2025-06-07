const express = require('express');
const cors = require('cors');
const path = require('path');
const { upload, processarImagem } = require('./api/infinity-maker');
const { mockProcessarImagem } = require('./api/mock-api');
const app = express();

// Habilitar registro de solicitações
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configurando o CORS para permitir requisições da aplicação frontend
app.use(cors());

// Processar dados de formulário URL-encoded
app.use(express.urlencoded({ extended: true }));

// Processar dados JSON
app.use(express.json());

// Servir arquivos estáticos da pasta atual
app.use(express.static(path.join(__dirname)));

// Configurar rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de teste para verificar se a API está funcionando
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Rota para a API de processamento de imagens
app.post('/api/infinity-maker', upload.single('photo'), processarImagem);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});