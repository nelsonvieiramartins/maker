// Versão simplificada do servidor para diagnóstico
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Configuração para armazenar arquivos enviados
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Criar pasta de uploads se não existir
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware para logs
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Habilitar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Servir arquivos estáticos
app.use(express.static(__dirname));

// Rota para processar a imagem
app.post('/api/infinity-maker', upload.single('photo'), (req, res) => {
  try {
    // Registrar todas as informações da requisição
    console.log('==== PROCESSANDO REQUISIÇÃO ====');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    if (!req.file) {
      console.log('ERRO: Nenhum arquivo recebido!');
      return res.status(400).json({ 
        error: 'Nenhum arquivo enviado',
        success: false
      });
    }
    
    // Extrair dados do formulário
    const base = req.body.base || 'desconhecido';
    const acessorio = req.body.acessorio || 'nenhum';
    
    console.log(`Base: ${base}, Acessório: ${acessorio}`);
    
    // Criar URL para a imagem estática (independente de serviços externos)
    let imagemUrl;
    
    if (req.file) {
      // Usar o arquivo carregado
      imagemUrl = `/uploads/${path.basename(req.file.path)}`;
      console.log('Imagem salva em:', imagemUrl);
    } else {
      // Fallback para uma imagem estática
      imagemUrl = '/fallback.jpg';
    }
    
    // Enviar resposta
    console.log('Enviando resposta com sucesso');
    return res.json({
      urlImagem: imagemUrl,
      success: true,
      base: base,
      acessorio: acessorio,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('ERRO NO PROCESSAMENTO:', error);
    return res.status(500).json({
      error: 'Erro interno no servidor: ' + error.message,
      success: false
    });
  }
});

// Rota para testar o servidor
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online', 
    version: '1.0.0',
    time: new Date().toISOString() 
  });
});

// Criar arquivo de fallback se não existir
const fallbackPath = path.join(__dirname, 'fallback.jpg');
if (!fs.existsSync(fallbackPath)) {
  try {
    // Cria um arquivo de texto simples como fallback
    fs.writeFileSync(fallbackPath, 'Imagem de fallback');
    console.log('Arquivo de fallback criado');
  } catch (err) {
    console.error('Erro ao criar arquivo de fallback:', err);
  }
}

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor simplificado rodando na porta ${PORT}`);
  console.log(`Pasta atual: ${__dirname}`);
});