// Arquivo para processar as requisições da API
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Configurando o upload de arquivos em memória
const upload = multer();

// Função para processar a solicitação
async function processarImagem(req, res) {
  try {
    console.log('===== INÍCIO DO PROCESSAMENTO =====');
    console.log('Body completo:', req.body);
    console.log('Headers:', req.headers);
    
    // Extrair base e acessório do corpo da requisição
    const base = req.body?.base || 'desconhecido';
    const acessorio = req.body?.acessorio || 'nenhum';
    
    // Verificar se temos um arquivo
    const photo = req.file;
    
    console.log('Arquivo recebido:', photo ? 'SIM' : 'NÃO');
    
    if (!photo) {
      console.log('ERRO: Arquivo não recebido!');
      return res.status(400).json({ 
        error: 'Foto não enviada.', 
        detalhes: 'O campo "photo" é obrigatório.' 
      });
    }

    console.log('Dados do arquivo:', {
      fieldname: photo.fieldname,
      originalname: photo.originalname,
      mimetype: photo.mimetype,
      size: photo.size
    });
    
    console.log('Parâmetros:', { base, acessorio });

    // Gerar URL da imagem usando função simplificada que sempre funciona
    const imagemUrl = gerarImagemSimples(base, acessorio);
    console.log('URL gerada:', imagemUrl);
    
    // Enviar resposta com dados completos
    console.log('Enviando resposta...');
    return res.json({ 
      urlImagem: imagemUrl,
      success: true,
      base: base,
      acessorio: acessorio,
      timestamp: new Date().toISOString()
    });

    /* Código para API real - temporariamente desabilitado
    const formData = new FormData();
    formData.append('photo', photo.buffer, {
      filename: photo.originalname,
      contentType: photo.mimetype
    });
    formData.append('base', base);
    formData.append('acessorio', acessorio);

    console.log('Enviando solicitação para a API do Infinity Maker...');
    
    const response = await fetch('https://api.infinitymaker.com/gerar-personagem', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API:', errorData);
      throw new Error(errorData.message || 'Erro ao gerar o personagem.');
    }

    const data = await response.json();
    console.log('Resposta recebida com sucesso');
    res.json({ urlImagem: data.urlImagem });
    */
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: error.message });
  }
}

// Função simplificada para gerar uma URL de imagem local que sempre funciona
function gerarImagemSimples(base, acessorio) {
  // Retornar uma URL fixa para garantir que funcione
  return '/fallback.jpg?' + new Date().getTime() + '&base=' + base + '&acessorio=' + acessorio;
}

// Função para gerar uma URL de imagem simulada - não usada no momento
function gerarImagemMock(base, acessorio) {
  // Versão simplificada para evitar dependências externas
  return '/fallback.jpg?' + new Date().getTime() + '&base=' + base + '&acessorio=' + acessorio;
}

module.exports = {
  upload,
  processarImagem
};