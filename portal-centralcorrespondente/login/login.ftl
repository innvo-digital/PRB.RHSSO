<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    
    <#if section??> <!-- Verifica se "section" está definida -->
        <#if section == "form">                    
            <form id="prb-form" action="${url.loginAction}" method="post">
                <input name="username" placeholder="Usuário" type="text" data-inputtext required>
                <input name="password" placeholder="Senha" type="password" data-inputtext required>
                
               <#if realm.resetPasswordAllowed>
                            <span id="forgout"><a tabindex="5" href="${url.loginResetCredentialsUrl}">Esqueci minha senha</a></span>
                </#if>

                <button type="submit" class="button">Login</button>
            </form>

        <#elseif section == "info">
            <#if realm.password && realm.registrationAllowed && !usernameEditDisabled??>
                <div id="kc-registration">
                    <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
                </div>
            </#if>
        </#if>
    <#else>
        <span>Erro: Seção não definida.</span>
    </#if>

</@layout.registrationLayout>
