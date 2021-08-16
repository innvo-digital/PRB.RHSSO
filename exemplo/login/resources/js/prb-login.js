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
  const hostname = window.location.href;
  const uaDataIsMobile = navigator.userAgentData?.mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const realms = hostname.split('realms')[1].split('/')[1];
  const uri = hostname.split('auth')[0] +'auth/realms/'+realms
  const client_id = 'myclient';
  const username = document.getElementById('username');
  const my_cpf = document.getElementById('cpf');
  const password = document.getElementById('password');
  const password_label = document.getElementById('password-label');
  const login_btn = document.getElementById('prb-btn-login');
  const forgout = document.getElementById('forgout');
  const error_cpf = document.getElementById('error_cpf');
  const form_content = document.getElementById('form_content');
  const prb_form = document.getElementById('prb-form');
  
  forgout.style.display = 'none';
  error_cpf.style.display = 'none';
  password_label.style.display = 'none';

  function getToken(t){
    document.cookie = "KEYCLOAK_ACCESS_TOKEN="+t;
    
    if(isMobile){
      window.ReactNativeWebView.postMessage("KEYCLOAK_ACCESS_TOKEN="+t);
    }
  }

  my_cpf.addEventListener('keyup', function () {
    let cpf = my_cpf.value.replace(/[^\d]+/g, '');

    if (cpf.length <= 10) {
      password_label.style.display = 'none';
      error_cpf.style.display = 'none';
      login_btn.classList.add('disabled');
      forgout.style.display = 'none';
      password.value = '';
    } else if (isValidCPF(cpf) === false && cpf.length == 11) {
      password_label.style.display = 'none';
      error_cpf.style.display = 'flex';
      username.classList.add('error');
      login_btn.classList.add('disabled');
      password.value = '';
    } else if (isValidCPF(cpf) && cpf.length == 11) {
      password_label.style.display = 'flex';
      forgout.style.display = 'flex';
      username.classList.remove('error');
      error_cpf.style.display = 'none';
      password.focus();
      username.value = cpf;
      document.cookie = "KEYCLOAK_USERNAME="+cpf; 
      if(isMobile){
        window.ReactNativeWebView.postMessage("KEYCLOAK_USERNAME="+cpf);
      }
      
    } else {
      username.classList.remove('error');
      password_label.style.display = 'flex';
    }
  });

  password.addEventListener('focus', function (e) {
    form_content.classList.add('mt-15');
  });

  forgout.addEventListener('click', function (e) {
    e.preventDefault();
    document.cookie = "KEYCLOAK_FORGOT=true"; 
    if(isMobile){
      window.ReactNativeWebView.postMessage("KEYCLOAK_FORGOT=true")
    }
    return false
  });

  password.addEventListener('keyup', function () {
    let pass = password.value.replace(/[^\d]+/g, '');
    password.value = '';
    password.value = pass;
    if (pass.length >= 6) {
      login_btn.classList.remove('disabled');
    } else {
      login_btn.classList.add('disabled');
    }
  });

  password.addEventListener('paste', function (event) {
    event.preventDefault();
    let paste = (event.clipboardData || window.clipboardData).getData('text').replace(/[^\d]+/g, '');
    password.value = '';
    password.value = paste;
    if (paste.length >= 6) {
      login_btn.classList.remove('disabled');
    } else {
      login_btn.classList.add('disabled');
    }
  });

  prb_form.addEventListener('submit',function (e) {
    e.preventDefault(); 

    if(!isMobile){
      prb_form.submit();
      return true;
    }

    let userData = getUserToken(cpf.value.replace(/[^\d]+/g, ''), password.value, client_id, uri);
    userData.then(response => {return response; }).then(response => {
      getToken(response.access_token);
    });
    
    return false;

  });

};

const getUserToken = async (u,p,c,h) => {
  try {
    var data = {
      client_id: c,
      username: u,
      password: p,
      grant_type: 'password',
    };

    var axiosConfig = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded;',
          "Access-Control-Allow-Origin": "*",
      }
    };

    const response = await axios.post(h+'/protocol/openid-connect/token/', new URLSearchParams(data), axiosConfig)
    const userData = response.data;
    if(userData.access_token){
      return userData;
    }
    return false;
  } catch(e) {
    throw e;
  }
}

$(document).ready(function () {
  $('#cpf').mask('000.000.000-00');
});
