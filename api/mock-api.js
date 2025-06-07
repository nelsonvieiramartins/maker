// API de simulação para testes sem depender da API real
// Isso permite que o frontend funcione mesmo se a API real não estiver disponível

function mockImagemGerada() {
  // Retornar uma URL de imagem de exemplo
  const imagens = [
    'https://via.placeholder.com/500x500?text=Personagem+Estilizado',
    'https://placehold.co/600x400/orange/white?text=Personagem+Gerado',
    'https://placehold.co/600x400/purple/white?text=Infinity+Maker'
  ];
  
  // Escolher uma imagem aleatória
  return imagens[Math.floor(Math.random() * imagens.length)];
}

// Função para simular o processamento da imagem
async function mockProcessarImagem(req, res) {
  try {
    const { base, acessorio } = req.body;
    const photo = req.file;

    if (!photo) {
      return res.status(400).json({ error: 'Foto não enviada.' });
    }

    console.log('Dados recebidos pelo mock:', {
      base,
      acessorio,
      photo: {
        fieldname: photo.fieldname,
        originalname: photo.originalname,
        mimetype: photo.mimetype,
        size: photo.size
      }
    });

    // Simular um tempo de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Retornar uma resposta simulada
    res.json({ 
      urlImagem: mockImagemGerada(),
      success: true,
      message: 'Imagem processada com sucesso (simulação)'
    });
  } catch (error) {
    console.error('Erro no mock:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  mockProcessarImagem
};