document.addEventListener("DOMContentLoaded", function () {
  // ELEMENTOS DE TELA
  const cpfText = document.querySelector("#prb-text-cpf");
  const cpfHidden = document.querySelector("#username");
  const cpf = document.querySelector("#prb-input-cpf");
  const cpfErro = document.querySelector("#prb-erro-cpf");

  const passwordText = document.querySelector("#prb-text-password");
  const password = document.querySelector("#prb-password");
  const passwordInput = document.querySelector("#password");

  const forgot = document.querySelector("#prb-forgot");

  const button = document.querySelector("#prb-button-login");

  //   VARIAVEIS DE CONTROLE
  let cpfValido = null;

  // EVENTOS
  cpf.addEventListener("keyup", function () {
    const cpfMascarado = mascaraCPF(cpf.value);

    cpf.value = cpfMascarado;
    cpfHidden.value = apenasNumeros(cpf.value);

    verificaTratativasAposDigitarCPF(cpfMascarado);
  });

  cpf.addEventListener("paste", function (event) {
    event.preventDefault();

    let paste = mascaraCPF(
      (event.clipboardData || window.clipboardData).getData("text")
    );

    cpf.value = "";
    cpfHidden.value = "";
    cpf.value = paste;
    cpfHidden.value = apenasNumeros(paste);

    verificaTratativasAposDigitarCPF(paste);
  });

  passwordInput.addEventListener("keyup", function () {
    passwordInput.value = apenasNumeros(passwordInput.value);

    VerificaLiberaBotaoSubmit();
  });

  passwordInput.addEventListener("paste", function (event) {
    event.preventDefault();

    let paste = apenasNumeros(
      (event.clipboardData || window.clipboardData).getData("text")
    );

    passwordInput.value = "";
    passwordInput.value = paste;

    VerificaLiberaBotaoSubmit();
  });

  function verificaTratativasAposDigitarCPF(cpfMascarado) {
    if (cpf.value.length === 14) {
      cpfValido = validarCPF(cpfMascarado);

      if (cpfValido) {
        cpfText.classList.add("hide");
        passwordText.classList.remove("hide");

        password.classList.remove("hide");
        passwordInput.focus();

        forgot.classList.remove("hide");
      } else {
        cpfText.classList.remove("hide");
        passwordText.classList.add("hide");

        cpf.classList.add("prb-error");
        cpfErro.classList.remove("hide");
      }
    } else {
      cpfValido = null;

      cpfText.classList.remove("hide");
      passwordText.classList.add("hide");

      cpf.classList.remove("prb-error");
      cpfErro.classList.add("hide");

      password.classList.add("hide");
      passwordInput.value = "";

      forgot.classList.add("hide");
      button.classList.add("disabled");
    }
  }

  function verificaLiberaBotaoSubmit() {
    if (passwordInput.value.length >= 6 && passwordInput.value.length <= 8) {
      button.classList.remove("disabled");
    } else {
      button.classList.add("disabled");
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
