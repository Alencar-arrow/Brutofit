// nav.js - monta o cabeçalho/menu dinamicamente (equivalente ao nav.php + logoOff.php)

function renderNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) return;

  const sessao = getSessao();

  let areaUsuario = "";
  if (sessao && sessao.logado) {
    const foto = sessao.foto
      ? `<a href="#"><img class="nav-foto-usuario" src="${sessao.foto}" alt="Foto de ${sessao.nome}"></a>`
      : "";
    areaUsuario = `
      <a href="#" class="nav-usuario">Olá, ${sessao.nome}</a>
      ${foto}
      <a href="listasUsuarios.html">Usuários</a>
      <a href="#" id="logoutBtn">Sair</a>
    `;
  } else {
    areaUsuario = `<a href="login.html">Entrar</a>`;
  }

  placeholder.innerHTML = `
    <header>
      <div class="nav">
        <div>
          <p class="logo"><a href="index.html"><img src="logo/logo2.svg" alt="BrutoFit"></a></p>
        </div>
        <ul class="menu">
          <a href="index.html">Início</a>
          <a href="addEquipamento.html">Adicionar</a>
          <a href="listarEquipamentos.html">Listar</a>
          <a href="pesquisarEquipamentos.html">Pesquisar</a>
          <a href="contato.html">Contato</a>
          ${areaUsuario}
        </ul>
      </div>
    </header>
  `;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      encerrarSessao();
      window.location.href = "login.html";
    });
  }
}
