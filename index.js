const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/buscar', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Parâmetro q é obrigatório' });

  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(query)}`;

try {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await response.json();

  if (!data.results) {
    return res.status(500).json({ 
      error: 'Resposta da API não contém "results"', 
      data 
    });
  }

  const resultados = data.results.slice(0, 5).map(item => ({
    title: item.title,
    thumbnail: item.thumbnail.replace('http:', 'https:'),
    permalink: item.permalink,
    price: item.price
  }));

  res.json(resultados);
} catch (err) {
  res.status(500).json({ error: 'Erro ao buscar no Mercado Livre', detail: err.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy Mercado Livre rodando na porta ${PORT}`);
});
