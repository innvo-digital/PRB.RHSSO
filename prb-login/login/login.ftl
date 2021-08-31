<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">

        <form id="prb-form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">

            <div class="prb-content">

                <div class="prb-input-group">
                    <label 
                        for="prb-input-cpf"
                        class="prb-label"
                    >
                        CPF
                    </label>
                    <input 
                        id="username"
                        name="username"
                        type="hidden"
                    />
                    <input
                        tabindex="1"
                        type="text"
                        class="prb-input"
                        placeholder="ex. 123.456.789-90"
                        id="prb-input-cpf"
                        inputmode="numeric"
                        autocomplete="off"
                        maxlength="14"
                    />
                    <span
                        class="prb-error hide"
                        id="prb-erro-cpf"
                    >
                        O CPF digitado está incorreto.
                    </span>
                </div>

                <div class="prb-input-group">
                    <label 
                        for="password"
                        id="prb-label-senha"
                        class="prb-label disabled"
                    >
                        Senha
                    </label>
                    <input
                        tabindex="2"
                        type="password"
                        class="prb-input"
                        disabled
                        placeholder="••••••"
                        id="password"
                        name="password"
                        inputmode="numeric"
                        autocomplete="off"
                        maxlength="8"
                    />
                </div>
                
                <#if realm.resetPasswordAllowed>
                    <a 
                        tabindex="4"
                        href="prbapp/forgot"
                        class="prb-forgot"
                        id="prb-link-forgot"
                    >
                        Esqueci minha senha
                    </a>
                </#if>
            </div>

            <footer class="prb-footer prb-container">
                <button
                    tabindex="3"
                    disabled
                    class="prb-button"
                    id="prb-button-login"
                    name="login"
                    type="submit"
                >
                    Continuar
                </button>
            </footer>
            
        </form>
    </#if>

</@layout.registrationLayout>
