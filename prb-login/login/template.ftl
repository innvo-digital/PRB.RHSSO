<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayWide=false>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

    <link rel="apple-touch-icon" sizes="57x57" href="${url.resourcesPath}/img/apple-icon-57x57.png"/>
    <link rel="apple-touch-icon" sizes="60x60" href="${url.resourcesPath}/img/apple-icon-60x60.png"/>
    <link rel="apple-touch-icon" sizes="72x72" href="${url.resourcesPath}/img/apple-icon-72x72.png"/>
    <link rel="apple-touch-icon" sizes="76x76" href="${url.resourcesPath}/img/apple-icon-76x76.png"/>
    <link rel="apple-touch-icon" sizes="114x114" href="${url.resourcesPath}/img/apple-icon-114x114.png"/>
    <link rel="apple-touch-icon" sizes="120x120" href="${url.resourcesPath}/img/apple-icon-120x120.png"/>
    <link rel="apple-touch-icon" sizes="144x144" href="${url.resourcesPath}/img/apple-icon-144x144.png"/>
    <link rel="apple-touch-icon" sizes="152x152" href="${url.resourcesPath}/img/apple-icon-152x152.png"/>
    <link rel="apple-touch-icon" sizes="180x180" href="${url.resourcesPath}/img/apple-icon-180x180.png"/>
    <link rel="icon" type="image/png" sizes="192x192"  href="${url.resourcesPath}/img/android-icon-192x192.png"/>
    <link rel="icon" type="image/png" sizes="32x32" href="${url.resourcesPath}/img/favicon-32x32.png"/>
    <link rel="icon" type="image/png" sizes="96x96" href="${url.resourcesPath}/img/favicon-96x96.png"/>
    <link rel="icon" type="image/png" sizes="16x16" href="${url.resourcesPath}/img/favicon-16x16.png"/>
    <link rel="manifest" href="${url.resourcesPath}/img/manifest.json"/>
    <meta name="msapplication-TileColor" content="#1a53ff"/>
    <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
    <meta name="theme-color" content="#1a53ff"/>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">

    <#if properties.meta?has_content>
        <#list properties.meta?split(' ') as meta>
            <meta name="${meta?split('==')[0]}" content="${meta?split('==')[1]}"/>
        </#list>
    </#if>

    <title>Paraná Banco - Login</title>

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

<body>
    <header class="prb-header prb-container">
        <img src="${url.resourcesPath}/img/Logo.png" width="32" height="32" />
    </header>

    <main class="prb-container">
        <div id="prb-text-cpf">
            <p class="prb-title">
                Informe o seu <span class="prb-highlight">CPF</span>
            </p>

            <p class="prb-text">
                Este é um ambiente seguro. Seu CPF será usado apenas para validar a
                sua identidade.
            </p>
        </div>

        <div id="prb-text-password" class="hide">
            <p class="prb-title">
                Agora,<br />
                informe sua <span class="prb-highlight">SENHA</span>
            </p>

            <p class="prb-text">
                Sua senha precisa ter entre 6 e 8 números.
            </p>
        </div>

        <#if displayMessage && message?has_content>
            <span class="prb-error" id="prb-error-password">
                O usuário ou senha digitado está incorreto.
            </span>
        </#if>

        <#nested "form">

    </main>
</body>
    <#if properties.script?has_content>
        <#list properties.script?split(' ') as script>
            <script src="${url.resourcesPath}/${script}" type="text/javascript"></script>
        </#list>
    </#if>
</html>
</#macro>
