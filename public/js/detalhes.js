const API_URL = 'http://localhost:3000/jogos';
const detalhesJogo = document.getElementById('detalhesJogo');

function obterIdDaUrl() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('id');
}

async function carregarDetalhes() {
  const id = obterIdDaUrl();

  if (!id) {
    detalhesJogo.innerHTML = '<p>Jogo não encontrado. ID não informado na URL.</p>';
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/${id}`);

    if (!resposta.ok) {
      throw new Error('Jogo não encontrado');
    }

    const jogo = await resposta.json();

    detalhesJogo.innerHTML = `
      <img src="${jogo.imagem}" alt="Capa do jogo ${jogo.titulo}" onerror="this.src='https://placehold.co/900x500?text=Sem+Imagem'">
      <h2>${jogo.titulo}</h2>
      <p><strong>Gênero:</strong> ${jogo.genero}</p>
      <p><strong>Plataforma:</strong> ${jogo.plataforma}</p>
      <p><strong>Ano:</strong> ${jogo.ano}</p>
      <p><strong>Nota:</strong> ${jogo.nota}</p>
      <p><strong>Descrição:</strong> ${jogo.descricao}</p>
      <br>
      <a href="index.html">Voltar</a>
    `;
  } catch (erro) {
    detalhesJogo.innerHTML = '<p>Erro ao carregar os detalhes do jogo.</p>';
  }
}

carregarDetalhes();
