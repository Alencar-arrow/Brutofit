// app.js - comportamentos de interface (equivalente ao app.js original, sem jQuery/ajax)

// Fecha a mensagem de sucesso/erro ao clicar nela
document.addEventListener("click", function (e) {
  const alvo = e.target.closest(".sucesso, .erro");
  if (alvo) {
    alvo.style.transition = "opacity 0.4s ease";
    alvo.style.opacity = "0";
    setTimeout(() => alvo.remove(), 400);
  }
});

// Exclui um equipamento (antes era feito via AJAX para excluir.php)
function excluirEquipamento(codigo) {
  const resp = confirm("Confirma excluir o registro " + codigo + "?");
  if (resp) {
    excluirEquipamentoPorCodigo(codigo);
    definirMensagem('<p class="sucesso">Registro excluído com sucesso!</p>');
    window.location.reload();
  }
}

// Exclui um usuário
function excluirUsuario(codigo) {
  const resp = confirm("Confirma excluir o registro " + codigo + "?");
  if (resp) {
    excluirUsuarioPorCodigo(codigo);
    definirMensagem('<p class="sucesso">Registro excluído com sucesso!</p>');
    window.location.reload();
  }
}
