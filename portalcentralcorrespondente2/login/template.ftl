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

<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" />
<link rel="stylesheet" href="${url.resourcesPath}/css/bootstrap.min.css" crossorigin="anonymous" />
<link rel="stylesheet" href="${url.resourcesPath}/css/bootstrap-icons.min.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/reset.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/header.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/typograph.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/footer.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/form.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/input.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/button.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/alert.css" />
<link rel="stylesheet" href="${url.resourcesPath}/css/login.css" />    
<script defer src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
<script defer src="${url.resourcesPath}/js/inputtext.jquery.js"></script>
<script defer src="${url.resourcesPath}/js/form.js?1"></script>
    <script src="${url.resourcesPath}/js/axios.min.js"></script>

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

<body class="min-vh-100">
    <div class="d-flex flex-column min-vh-100">
        <div class="login flex-fill">
            <div class="login__wrapper d-flex align-items-center">
                <main class="login__form">
                    <svg class="login__logo" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1622.1 252">
                        <path d="M157.5,0h-63C42.3,0,0,42.3,0,94.5v63C0,209.7,42.3,252,94.5,252h63c52.2,0,94.5-42.3,94.5-94.5c0,0,0,0,0,0 v-63C252,42.3,209.7,0,157.5,0z M200,153c-14.9,40.9-60.1,61.9-101,47c-21.8-8-39-25.2-47-47c-1.2-3.3,0.5-6.9,3.7-8.1 c0.2-0.1,0.4-0.1,0.5-0.2l26-7c3-0.8,6.2,0.7,7.4,3.6c8.5,20,31.5,29.4,51.6,21c9.5-4,17-11.5,21-21c1.2-2.9,4.4-4.4,7.4-3.6l26,7 c3.4,0.9,5.4,4.3,4.5,7.7C200.2,152.6,200.1,152.8,200,153z"/>
                        <path d="M369.2,62.3c11.2,0,20.9,1.9,29.1,5.6c7.7,3.3,14.3,8.8,19,15.8c4.4,6.9,6.7,15,6.7,24.3 c0,9.3-2.2,17.3-6.7,24.2c-4.6,7-11.2,12.6-19,15.9c-8.2,3.7-17.9,5.5-29.1,5.5h-25.4v34.8h-29.2V62.3H369.2z M365.6,86.1h-21.9 v43.7h20.3c0.5,0,1,0,1.5,0h7c12.1-0.3,21.7-10.3,21.4-22.4c-0.3-11.7-9.7-21.2-21.4-21.4L365.6,86.1z M542,91.5v96.9h-26.8v-11.2 c-7,8.4-17,12.6-30.2,12.6c-8.6,0.1-17.2-2-24.8-6.1c-7.3-4-13.4-10.1-17.4-17.5c-4.2-7.6-6.3-16.3-6.3-26.3c0-10,2.1-18.7,6.3-26.3 c4-7.4,10-13.4,17.4-17.5c7.6-4.1,16.1-6.2,24.8-6.1c12.4,0,22,3.9,29,11.7V91.5H542z M488.4,113.1c-14.9,0-26.9,12.1-26.9,26.9 c0,14.9,12.1,26.9,26.9,26.9l0,0c14.9,0,26.9-12.1,26.9-26.9C515.4,125.1,503.3,113.1,488.4,113.1z M592.4,104.3 c3.4-4.7,8.2-8.4,13.6-10.6c6.3-2.5,13-3.7,19.7-3.6V116c-3.1-0.2-5.2-0.4-6.3-0.4c-8,0-14.3,2.3-18.9,6.8 c-4.6,4.5-6.8,11.3-6.8,20.3v45.8h-28.1V91.5h26.8L592.4,104.3z M838,146.4c0-0.3,0-0.6,0-0.9v-10.9c-0.3-11.8-10.1-21.2-21.9-21 c-11.5,0.2-20.7,9.5-21,21v10.9c0,0.3,0,0.7,0,1v41.9H767V91.5h26.8v11.3c3.8-4.2,8.6-7.4,13.9-9.5c5.8-2.3,12-3.4,18.2-3.3 c12,0,21.7,3.6,29.1,10.8s11.1,17.9,11.1,32.1v55.5H838V146.4z M937.6,54h48.9l-29.7,18.2h-36.8L937.6,54z M1117.3,122.8 c6.7,1.9,12.6,5.9,16.9,11.4c4.1,5.3,6.1,11.9,6.1,19.7c0,11.1-4.3,19.5-12.9,25.5c-8.6,5.9-21.1,8.9-37.5,8.9h-65.2V62.3h61.6 c15.3,0,27.1,2.9,35.4,8.8c8.3,5.9,12.4,13.9,12.3,24C1134.3,106.9,1127.8,117.7,1117.3,122.8L1117.3,122.8z M1070.3,135.2h-15.9 v31.7h40.7c8.8,0,15.8-7.1,15.8-15.9s-7.1-15.9-15.8-15.9H1070.3z M1068.4,86.1h-14v27.9h36.4c7.7-0.7,13.4-7.4,12.8-15.1 c-0.6-6.8-6-12.2-12.8-12.8H1068.4z M1458.5,113.2c-0.7-0.1-1.4-0.1-2.1-0.1l0,0c-2.8,0-5.6,0.5-8.2,1.4c-3.6,1.2-6.8,3.2-9.4,5.9 c-1.2,1.2-2.3,2.6-3.3,4.1c-2.6,4-4,8.7-4,13.5v4c0,13.7,11.1,24.9,24.9,24.9l0,0c1.4,0,2.8-0.1,4.2-0.4c7.8-1,13.9-5.4,18.2-13.1 l21.8,11.9c-3.5,7.6-9.3,14-16.7,18c-7.6,4.3-16.5,6.5-26.7,6.5c-9.7,0.2-19.2-2-27.8-6.4c-24-12.3-33.5-41.7-21.3-65.7 c4.7-9.2,12.1-16.6,21.3-21.3c8.6-4.4,18.2-6.6,27.8-6.4c10.2,0,19.1,2.1,26.7,6.4c7.4,4.1,13.3,10.5,16.7,18.3l-21.8,11.7 C1474,118,1467.2,113.6,1458.5,113.2z M1569,189.8c-9.5,0.2-19-2-27.5-6.4c-7.9-4-14.4-10.2-19-17.7c-9.1-16-9.1-35.6,0-51.5 c4.6-7.6,11.1-13.7,19-17.7c17.3-8.5,37.6-8.5,54.8,0c7.8,4.1,14.4,10.2,18.9,17.7c9.1,16,9.1,35.6,0,51.5 c-4.6,7.5-11.1,13.7-18.9,17.7C1587.9,187.8,1578.5,190,1569,189.8z M1568.9,166.8c14.8,0,26.9-12,26.9-26.9 c0-14.9-12-26.9-26.9-26.9c-14.9,0-26.9,12-26.9,26.9c0,0,0,0,0,0.1C1542,154.8,1554.1,166.9,1568.9,166.8L1568.9,166.8z  M743.5,91.5v96.9h-26.8v-11.2c-7,8.4-17.1,12.6-30.3,12.6c-8.6,0.1-17.2-2-24.8-6.1c-7.3-4-13.4-10.1-17.4-17.5 c-4.2-7.6-6.3-16.3-6.3-26.3c0-10,2.1-18.7,6.3-26.3c4-7.4,10-13.4,17.4-17.5c7.6-4.1,16.1-6.2,24.8-6.1c12.4,0,22,3.9,29,11.7V91.5 H743.5z M689.9,113.1c-14.9,0-26.9,12.1-26.9,26.9c0,14.9,12.1,26.9,26.9,26.9l0,0c14.9,0,26.9-12.1,26.9-26.9 C716.8,125.1,704.8,113.1,689.9,113.1z M988.4,91.5v96.9h-26.8v-11.2c-7,8.4-17,12.6-30.3,12.6c-8.7,0.1-17.2-2-24.8-6.1 c-7.3-4-13.4-10.1-17.4-17.5c-4.2-7.6-6.3-16.3-6.3-26.3c0-10,2.1-18.7,6.3-26.3c4-7.4,10.1-13.4,17.4-17.5 c7.6-4.1,16.1-6.2,24.8-6.1c12.4,0,22,3.9,29,11.7V91.5H988.4z M934.8,113.1c-14.9,0-26.9,12.1-26.9,26.9c0,14.9,12,26.9,26.9,26.9 l0,0c14.9,0,26.9-12.1,26.9-26.9C961.7,125.1,949.7,113.1,934.8,113.1z M1262.5,91.5v96.9h-26.8v-11.2c-7,8.4-17,12.6-30.3,12.6 c-8.6,0.1-17.2-2-24.8-6.1c-7.3-4-13.4-10.1-17.4-17.5c-4.2-7.6-6.3-16.3-6.3-26.3c0-10,2.1-18.7,6.3-26.3c4-7.4,10-13.4,17.4-17.5 c7.6-4.1,16.1-6.2,24.8-6.1c12.4,0,22,3.9,29,11.7V91.5H1262.5z M1208.9,113.1c-14.9,0-26.9,12.1-26.9,26.9 c0,14.9,12.1,26.9,26.9,26.9l0,0c14.9,0,26.9-12.1,26.9-26.9C1235.8,125.1,1223.8,113.1,1208.9,113.1z M1357,146.4 c0-0.3,0-0.6,0-0.9v-10.9c-0.3-11.8-10.1-21.2-21.9-21c-11.5,0.2-20.7,9.5-21,21v10.9c0,0.3,0,0.7,0,1v41.9h-28V91.5h26.8v11.3 c3.8-4.2,8.6-7.4,13.9-9.5c5.8-2.3,12-3.4,18.2-3.3c12,0,21.7,3.6,29.1,10.8s11.1,17.9,11.1,32.1v55.5H1357V146.4z"/>
                    </svg>
                    <h1 class="heading-2">Olá, vamos começar</h1>
                    <h1 class="heading-2 fw-bold">Preencha seu login e senha abaixo</h1>
                <#if displayInfo>
                    <div id="kc-info" class="${properties.kcSignUpClass!}">
                        <div id="kc-info-wrapper" class="${properties.kcInfoAreaWrapperClass!}">
                            <#nested "info">
                        </div>
                    </div>
                </#if>  
                <#nested "form">
                <#if displayMessage && message?has_content>  
                    <div class="alert alert-${message.type}">
                        <#if message.type = 'error'><div class="p-4 mt-2 mb-2 alert alert-danger rounded">${message.summary}</div></#if>
                    </div>
                </#if>
                </main>
                <div class="login-image__wrapper flex-fill" aria-hidden="true">
                    <div class="login-image__aside"></div>
                </div>
            </div>
        </div>
    </div>
</body>
    <#if properties.script?has_content>
        <#list properties.script?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
</html>
</#macro>
