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

function getToken(t){
  window.ReactNativeWebView.postMessage("KEYCLOAK_REFRESH_TOKEN="+t.refresh_token);
  window.ReactNativeWebView.postMessage("KEYCLOAK_ACCESS_TOKEN="+t.access_token);
}

function maskCPF(cpf){
  cpf=cpf.replace(/\D/g,"")
  cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
  cpf=cpf.replace(/(\d{3})(\d)/,"$1.$2")
  cpf=cpf.replace(/(\d{3})(\d{1,2})$/,"$1-$2")
  return cpf
}

window.onload = function () {
  const hostname = window.location.href;
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


  prb_form.addEventListener('submit',function (e) {
    e.preventDefault(); 

    if(!isMobile){
      prb_form.submit();
      return true;
    }

    let userData = getUserToken(cpf.value.replace(/[^\d]+/g, ''), password.value, client_id, uri);
    userData.then(response => {return response; }).then(response => {
      getToken(response);
    });

    return true;

  });

};

async function getUserToken(u,p,c,h){
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
      const prb_form = document.getElementById('prb-form');
      prb_form.submit();
    throw e;
  }
}