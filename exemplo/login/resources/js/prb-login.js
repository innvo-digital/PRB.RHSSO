function isValidCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  if (
    cpf.length != 11 ||
    cpf == '00000000000' ||
    cpf == '11111111111' ||
    cpf == '22222222222' ||
    cpf == '33333333333' ||
    cpf == '44444444444' ||
    cpf == '55555555555' ||
    cpf == '66666666666' ||
    cpf == '77777777777' ||
    cpf == '88888888888' ||
    cpf == '99999999999'
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

window.onload = function () {
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const password_label = document.getElementById('password-label');
  const login_btn = document.getElementById('prb-btn-login');
  const forgout = document.getElementById('forgout');
  const error_cpf = document.getElementById('error_cpf');
  const form_content = document.getElementById('form_content');

  forgout.style.display = 'none';
  error_cpf.style.display = 'none';
  password_label.style.display = 'none';

  username.addEventListener('keyup', function () {
    let cpf = username.value.replace(/[^\d]+/g, '');

    if (cpf.length <= 10) {
      password_label.style.display = 'none';
      error_cpf.style.display = 'none';
    } else if (isValidCPF(cpf) === false && cpf.length == 11) {
      password_label.style.display = 'none';
      forgout.style.display = 'none';
      error_cpf.style.display = 'flex';
      username.classList.add('error');
    } else if (isValidCPF(username.value) && cpf.length == 11) {
      password_label.style.display = 'flex';
      forgout.style.display = 'flex';
      username.classList.remove('error');
      error_cpf.style.display = 'none';
      password.focus();
    } else {
      username.classList.remove('error');
      password_label.style.display = 'flex';
    }
  });

  password.addEventListener('focus', function (e) {
    form_content.classList.add('mt-15');
  });

  password.addEventListener('keyup', function () {
    if (password.value.length >= 6) {
      login_btn.classList.remove('disabled');
    } else {
      login_btn.classList.add('disabled');
    }
  });
};

$(document).ready(function () {
  $('#username').mask('000.000.000-00');
});
