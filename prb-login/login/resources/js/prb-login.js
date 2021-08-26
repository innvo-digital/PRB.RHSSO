document.addEventListener("DOMContentLoaded", function () {
  // ELEMENTOS DE TELA
  const cpfHidden = document.querySelector("#username");
  const cpf = document.querySelector("#prb-input-cpf");
  const cpfErro = document.querySelector("#prb-erro-cpf");

  const passwordLabel = document.querySelector("#prb-label-senha");
  const password = document.querySelector("#password");

  const errorLogin = document.querySelector("#prb-error-login");

  const button = document.querySelector("#prb-button-login");

  // EVENTOS
  cpf.addEventListener("input", function () {
    const cpfLimitado = cpf.value.slice(0, 14);
    const cpfMascarado = mascaraCPF(cpfLimitado);

    cpf.value = cpfMascarado;
    cpfHidden.value = apenasNumeros(cpfLimitado);

    verificaTratativasAposDigitarCPF(cpfMascarado);
  });

  cpf.addEventListener("paste", function (event) {
    event.preventDefault();

    let paste = (event.clipboardData || window.clipboardData).getData("text");

    paste = apenasNumeros(paste);
    paste = paste.slice(0, 11);
    paste = mascaraCPF(paste);

    cpf.value = "";
    cpfHidden.value = "";
    cpf.value = paste;
    cpfHidden.value = apenasNumeros(paste);

    verificaTratativasAposDigitarCPF(paste);
  });

  password.addEventListener("input", function () {
    password.value = apenasNumeros(password.value.slice(0, 8));

    verificaLiberaBotaoSubmit();
  });

  password.addEventListener("paste", function (event) {
    event.preventDefault();

    let paste = (event.clipboardData || window.clipboardData).getData("text");

    paste = apenasNumeros(paste);
    paste = paste.slice(0, 8);

    password.value = "";
    password.value = paste;

    verificaLiberaBotaoSubmit();
  });

  // FUNÇÕES DE CONTROLE
  function verificaTratativasAposDigitarCPF(cpfMascarado) {
    if (errorLogin) {
      errorLogin.classList.add("hide");
    }

    if (cpfMascarado.length === 14) {
      const cpfValido = validarCPF(cpfMascarado);

      if (cpfValido) {
        cpf.classList.remove("prb-error");
        cpfErro.classList.add("hide");

        passwordLabel.classList.remove("disabled");
        password.removeAttribute("disabled");
        password.focus();
      } else {
        cpf.classList.add("prb-error");
        cpfErro.classList.remove("hide");
      }
    } else {
      cpf.classList.remove("prb-error");
      cpfErro.classList.add("hide");

      passwordLabel.classList.add("disabled");
      password.value = "";
      password.setAttribute("disabled", "disabled");

      verificaLiberaBotaoSubmit();
    }
  }

  function verificaLiberaBotaoSubmit() {
    if (password.value.length >= 6 && password.value.length <= 8) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "disabled");
    }
  }

  //   HELPERS
  function mascaraCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return cpf;
  }

  function apenasNumeros(value) {
    return value.replace(/[^\d]+/g, "");
  }

  function validarCPF(cpf) {
    cpf = apenasNumeros(cpf);
    if (cpf == "") return false;
    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    )
      return false;
    // Valida 1o digito
    add = 0;
    for (i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;
    return true;
  }
});
