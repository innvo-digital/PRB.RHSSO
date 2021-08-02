<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
        <form id="prb-form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            
                <label id="username-label" for="username" class="${properties.kcLabelClass!}"><span>CPF</span>
                    <input tabindex="1" id="username" name="username" value="${(login.username!'')}" type="hidden"/>
                    <input tabindex="1" id="cpf" class="prb-input" value="" type="text" inputmode="numeric" autocomplete="off" />
                    <span class="has-error" id="error_cpf">Insira um CPF válido.</span>
                </label>

                <label id="password-label" for="password" class="${properties.kcLabelClass!}"><span>Senha</span>
                    <input tabindex="2" id="password" class="prb-input" name="password" type="password" inputmode="numeric" autocomplete="off" maxlength="8"/>
                </label>

                <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <#if realm.resetPasswordAllowed>
                            <span id="forgout"><a tabindex="5" href="${url.loginResetCredentialsUrl}">Esqueci minha senha</a></span>
                        </#if>
                    </div>
                </div>
                
            <input tabindex="4" class="disabled" name="login" id="prb-btn-login" type="submit" value="Continuar"/>
        </form>    
        
    <#elseif section = "info" >
        <#if realm.password && realm.registrationAllowed && !usernameEditDisabled??>
            <div id="kc-registration">
                <span>${msg("noAccount")} <a tabindex="6" href="${url.registrationUrl}">${msg("doRegister")}</a></span>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>
