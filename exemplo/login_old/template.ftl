<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayWide=false>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>
    <title>${msg("loginTitle",(realm.displayName!''))}</title>
    <link rel="icon" href="${url.resourcesPath}/img/favicon.ico" />
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
    <#if properties.scripts?has_content>
        <#list properties.scripts?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
    <#if scripts??>
        <#list scripts as script>
            <script src="${script}" type="text/javascript"></script>
        </#list>
    </#if>
</head>

<body class="${properties.kcBodyClass!}">
    <div class="prb-header">
        <img src="${url.resourcesPath}/img/Logo.png" width="32" height="32">
    </div>

    <div class="prb-title">Agora,<br /> informe sua <span class="prb-highlight">SENHA</span></div>
    
    <div class="prb-text">Sua senha precisa ter entre 6 a 8 dígitos entre letras e números.</div>
    
    <#nested "form"> 

    <#-- <div class="${properties.kcFormCardClass!} <#if displayWide>${properties.kcFormCardAccountClass!}</#if>">
        <div id="kc-content">
            <div id="kc-content-wrapper">
                <#if displayMessage && message?has_content>
                    <div class="alert alert-${message.type}">
                        <#if message.type = 'success'><span class="${properties.kcFeedbackSuccessIcon!}"></span></#if>
                        <#if message.type = 'warning'><span class="${properties.kcFeedbackWarningIcon!}"></span></#if>
                        <#if message.type = 'error'><span class="${properties.kcFeedbackErrorIcon!}"></span></#if>
                        <#if message.type = 'info'><span class="${properties.kcFeedbackInfoIcon!}"></span></#if>
                        <span class="kc-feedback-text">${kcSanitize(message.summary)?no_esc}</span>
                    </div>
                </#if>  

                <#nested "form">

                  <#if displayInfo>
                    <div id="kc-info" class="${properties.kcSignUpClass!}">
                        <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                            <#nested "info">
                        </div>
                    </div>
                </#if>  
            </div>
        </div>

    </div>-->
</body>
<script type="text/javascript">
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const password_label = document.getElementById('password-label');
    const login_btn = document.getElementById('prb-btn-login');

    if(!!password_label){
        password_label.style.display = 'none';

        username.addEventListener('keyup',function() {
            username.classList.remove('error');

            if(username.value.length === 1){
                password_label.style.display = 'flex';
            }
        })

        username.addEventListener('blur',function() {
            if(username.value.length === 0){
                username.classList.add('error');
            }
        })


        password.addEventListener('keyup',function() {
            if(password.value.length >= 6){
                login_btn.classList.remove('disabled');
            }
            else {
                login_btn.classList.add('disabled');
            }
        })
    }

</script>
</html>
</#macro>
