const API_URL = 'http://localhost:3000/jogos';

const formJogo = document.getElementById('formJogo');
const jogoId = document.getElementById('jogoId');
const titulo = document.getElementById('titulo');
const genero = document.getElementById('genero');
const plataforma = document.getElementById('plataforma');
const ano = document.getElementById('ano');
const nota = document.getElementById('nota');
const imagem = document.getElementById('imagem');
const descricao = document.getElementById('descricao');
const listaJogos = document.getElementById('listaJogos');
const mensagem = document.getElementById('mensagem');
const formTitulo = document.getElementById('formTitulo');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const btnRecarregar = document.getElementById('btnRecarregar');

function mostrarMensagem(texto, tipo = 'sucesso') {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;

  setTimeout(() => {
    mensagem.textContent = '';
    mensagem.className = 'mensagem';
  }, 3500);
}

function validarFormulario(jogo) {
  if (!jogo.titulo || !jogo.genero || !jogo.plataforma || !jogo.descricao || !jogo.imagem) {
    return 'Preencha todos os campos obrigatórios.';
  }

  if (jogo.ano < 1970 || jogo.ano > 2030) {
    return 'Informe um ano válido entre 1970 e 2030.';
  }

  if (jogo.nota < 0 || jogo.nota > 10) {
    return 'A nota precisa estar entre 0 e 10.';
  }

  return null;
}

function obterDadosFormulario() {
  return {
    titulo: titulo.value.trim(),
    genero: genero.value.trim(),
    plataforma: plataforma.value.trim(),
    ano: Number(ano.value),
    nota: Number(nota.value),
    imagem: imagem.value.trim(),
    descricao: descricao.value.trim()
  };
}

function limparFormulario() {
  formJogo.reset();
  jogoId.value = '';
  formTitulo.textContent = 'Cadastrar jogo';
  btnSalvar.textContent = 'Salvar';
}

async function carregarJogos() {
  try {
    const resposta = await fetch(API_URL);
    const jogos = await resposta.json();

    listaJogos.innerHTML = '';

    if (jogos.length === 0) {
      listaJogos.innerHTML = '<p>Nenhum jogo cadastrado.</p>';
      return;
    }

    jogos.forEach((jogo) => {
      const card = document.createElement('article');
      card.className = 'jogo-card';

      card.innerHTML = `
        <img src="${jogo.imagem}" alt="Capa do jogo ${jogo.titulo}" onerror="this.src='https://placehold.co/600x400?text=Sem+Imagem'">
        <div class="jogo-card-content">
          <h3>${jogo.titulo}</h3>
          <p><strong>Gênero:</strong> ${jogo.genero}</p>
          <p><strong>Plataforma:</strong> ${jogo.plataforma}</p>
          <p><strong>Nota:</strong> ${jogo.nota}</p>
          <div class="acoes">
            <a href="detalhes.html?id=${jogo.id}">Detalhes</a>
            <button onclick="prepararEdicao('${jogo.id}')">Editar</button>
            <button class="perigo" onclick="excluirJogo('${jogo.id}')">Excluir</button>
          </div>
        </div>
      `;

      listaJogos.appendChild(card);
    });
  } catch (erro) {
    mostrarMensagem('Erro ao carregar dados. Verifique se o JSON Server está rodando.', 'erro');
  }
}

async function criarJogo(jogo) {
  const resposta = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jogo)
  });

  if (!resposta.ok) {
    throw new Error('Erro ao criar jogo');
  }
}

async function atualizarJogo(id, jogo) {
  const resposta = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jogo)
  });

  if (!resposta.ok) {
    throw new Error('Erro ao atualizar jogo');
  }
}

async function prepararEdicao(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`);
    const jogo = await resposta.json();

    jogoId.value = jogo.id;
    titulo.value = jogo.titulo;
    genero.value = jogo.genero;
    plataforma.value = jogo.plataforma;
    ano.value = jogo.ano;
    nota.value = jogo.nota;
    imagem.value = jogo.imagem;
    descricao.value = jogo.descricao;

    formTitulo.textContent = 'Editar jogo';
    btnSalvar.textContent = 'Atualizar';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (erro) {
    mostrarMensagem('Erro ao buscar jogo para edição.', 'erro');
  }
}

async function excluirJogo(id) {
  const confirmou = confirm('Tem certeza que deseja excluir este jogo?');

  if (!confirmou) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir jogo');
    }

    mostrarMensagem('Jogo excluído com sucesso!');
    carregarJogos();
  } catch (erro) {
    mostrarMensagem('Erro ao excluir jogo.', 'erro');
  }
}

formJogo.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const jogo = obterDadosFormulario();
  const erroValidacao = validarFormulario(jogo);

  if (erroValidacao) {
    mostrarMensagem(erroValidacao, 'erro');
    return;
  }

  try {
    if (jogoId.value) {
      await atualizarJogo(jogoId.value, jogo);
      mostrarMensagem('Jogo atualizado com sucesso!');
    } else {
      await criarJogo(jogo);
      mostrarMensagem('Jogo cadastrado com sucesso!');
    }

    limparFormulario();
    carregarJogos();
  } catch (erro) {
    mostrarMensagem('Erro ao salvar jogo.', 'erro');
  }
});

btnCancelar.addEventListener('click', limparFormulario);
btnRecarregar.addEventListener('click', carregarJogos);

carregarJogos();
