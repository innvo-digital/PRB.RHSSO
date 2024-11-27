<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
    <form id="prb-form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                <input name="username" placeholder="Usuário" type="text" data-inputtext required>
                <input name="password" placeholder="Senha" type="password" data-inputtext required>
                <button name="login" id="prb-btn-login" class="button">Login</button>
                <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <#if realm.resetPasswordAllowed>
                            <span id="forgout"><a tabindex="5" href="${url.loginResetCredentialsUrl}">Esqueci minha senha</a></span>
                        </#if>
                    </div>
                </div>                
    </form>    
    <#elseif section = "info">
        <#if realm.password && realm.registrationAllowed && !usernameEditDisabled??>
            <div id="kc-registration">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>
