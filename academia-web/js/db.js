// db.js
// Como o Live Server só serve arquivos estáticos (sem PHP/MySQL),
// este arquivo simula o "banco de dados" usando o localStorage do navegador.
// Cada "tabela" do banco original vira uma chave no localStorage.

const DB_KEYS = {
  EQUIPAMENTOS: "brutofit_equipamentos",
  USUARIOS: "brutofit_usuarios",
  SESSION: "brutofit_session",
  MSG: "brutofit_msg",
};

// ---------- Utilitários genéricos ----------

function lerTabela(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch (e) {
    return [];
  }
}

function salvarTabela(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

function proximoCodigo(lista) {
  if (lista.length === 0) return 1;
  return Math.max(...lista.map((i) => Number(i.codigo))) + 1;
}

// Mensagem "flash" (equivalente ao $_SESSION['msg'] do PHP)
function definirMensagem(html) {
  localStorage.setItem(DB_KEYS.MSG, html);
}

function consumirMensagem() {
  const msg = localStorage.getItem(DB_KEYS.MSG);
  localStorage.removeItem(DB_KEYS.MSG);
  return msg;
}

function exibirMensagemFlash() {
  const msg = consumirMensagem();
  const alvo = document.getElementById("mensagem-flash");
  if (alvo && msg) {
    alvo.innerHTML = msg;
  }
}

// Converte um <input type="file"> em base64 (Data URL) para simular o upload
function arquivoParaBase64(inputFile) {
  return new Promise((resolve) => {
    const file = inputFile.files && inputFile.files[0];
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

// Hash simples de senha usando SubtleCrypto (SHA-256)
async function hashSenha(senha) {
  const enc = new TextEncoder().encode(senha);
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- Seed inicial (equivalente aos INSERT dos arquivos .sql) ----------

async function seedDatabase() {
  if (!localStorage.getItem(DB_KEYS.EQUIPAMENTOS)) {
    const equipamentosSeed = [
      {
        codigo: 6,
        nome: "Peitoral crucifixo",
        musculo: "Peito",
        descricao: "Máquina para treinar o peitoral",
        foto: "imagens_academia/60e5c18910d95a7ffb651331d950b901jpg.webp",
      },
      {
        codigo: 7,
        nome: "Remada",
        musculo: "Costas",
        descricao: "Máquina para treinar as costas na parte superior",
        foto: "imagens_academia/e7c45bfce7a71f007fe7176adea8b97a.jpg",
      },
      {
        codigo: 8,
        nome: "Peitoral",
        musculo: "Peito",
        descricao: "Treino de peito",
        foto: "imagens_academia/191d438d6b31600aad475f2927efc666.jpg",
      },
      {
        codigo: 9,
        nome: "Puxada",
        musculo: "Costas",
        descricao: "Puxada para as costas",
        foto: "imagens_academia/6a2c126b4f3752ff60802e5bad73beb3.jpg",
      },
    ];
    salvarTabela(DB_KEYS.EQUIPAMENTOS, equipamentosSeed);
  }

  if (!localStorage.getItem(DB_KEYS.USUARIOS)) {
    const senhaHash = await hashSenha("123456");
    const usuariosSeed = [
      {
        codigo: 1,
        nome: "Administrador",
        email: "admin@brutofit.com",
        cargo: "adm",
        senha: senhaHash,
        foto: "",
      },
    ];
    salvarTabela(DB_KEYS.USUARIOS, usuariosSeed);
  }
}

// ---------- Equipamentos ----------

function listarEquipamentos() {
  return lerTabela(DB_KEYS.EQUIPAMENTOS);
}

function buscarEquipamentoPorCodigo(cod) {
  return listarEquipamentos().find((e) => Number(e.codigo) === Number(cod));
}

function salvarEquipamento(equip) {
  const lista = listarEquipamentos();
  equip.codigo = proximoCodigo(lista);
  lista.push(equip);
  salvarTabela(DB_KEYS.EQUIPAMENTOS, lista);
}

function atualizarEquipamento(cod, dadosNovos) {
  const lista = listarEquipamentos();
  const idx = lista.findIndex((e) => Number(e.codigo) === Number(cod));
  if (idx === -1) return false;
  lista[idx] = { ...lista[idx], ...dadosNovos, codigo: Number(cod) };
  salvarTabela(DB_KEYS.EQUIPAMENTOS, lista);
  return true;
}

function excluirEquipamentoPorCodigo(cod) {
  const lista = listarEquipamentos().filter(
    (e) => Number(e.codigo) !== Number(cod)
  );
  salvarTabela(DB_KEYS.EQUIPAMENTOS, lista);
}

// ---------- Usuários ----------

function listarUsuarios() {
  return lerTabela(DB_KEYS.USUARIOS);
}

function buscarUsuarioPorEmail(email) {
  return listarUsuarios().find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
}

function buscarUsuarioPorCodigo(cod) {
  return listarUsuarios().find((u) => Number(u.codigo) === Number(cod));
}

function salvarUsuario(usuario) {
  const lista = listarUsuarios();
  usuario.codigo = proximoCodigo(lista);
  lista.push(usuario);
  salvarTabela(DB_KEYS.USUARIOS, lista);
}

function atualizarUsuario(cod, dadosNovos) {
  const lista = listarUsuarios();
  const idx = lista.findIndex((u) => Number(u.codigo) === Number(cod));
  if (idx === -1) return false;
  lista[idx] = { ...lista[idx], ...dadosNovos, codigo: Number(cod) };
  salvarTabela(DB_KEYS.USUARIOS, lista);
  return true;
}

function excluirUsuarioPorCodigo(cod) {
  const lista = listarUsuarios().filter(
    (u) => Number(u.codigo) !== Number(cod)
  );
  salvarTabela(DB_KEYS.USUARIOS, lista);
}

// ---------- Sessão (equivalente ao $_SESSION do PHP) ----------

function getSessao() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEYS.SESSION));
  } catch (e) {
    return null;
  }
}

function setSessao(sessao) {
  localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(sessao));
}

function encerrarSessao() {
  localStorage.removeItem(DB_KEYS.SESSION);
}

function exigirLogin() {
  const sessao = getSessao();
  if (!sessao || !sessao.logado) {
    definirMensagem(
      '<p class="erro">Você precisa estar logado para acessar!</p>'
    );
    window.location.href = "login.html";
    return false;
  }
  return true;
}
