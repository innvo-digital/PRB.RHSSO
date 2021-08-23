<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">

        <form id="prb-form" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">

            <main class="prb-content prb-container">
                <div id="prb-text-cpf">
                    <p class="prb-title">
                        Informe o seu 
                        <span class="prb-highlight">CPF</span>
                    </p>

                    <p class="prb-text">
                        Este é um ambiente seguro. Seu CPF será usado apenas para validar a sua identidade.
                    </p>
                </div>

                <div id="prb-text-password" class="hide">
                    <p class="prb-title">
                        Agora,<br />
                        informe sua 
                        <span class="prb-highlight">SENHA</span>
                    </p>

                    <p class="prb-text">
                        Sua senha precisa ter entre 6 a 8 dígitos entre letras e números.
                    </p>
                </div>

                <div class="prb-input-group">
                    <label for="prb-cpf" class="prb-label">
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
                    <span class="prb-error hide" id="prb-erro-cpf">
                        Insira um CPF válido.
                    </span>                    
                </div>

                <div class="prb-input-group hide" id="prb-password">
                    <label for="prb-password" class="prb-label">
                        Senha
                    </label>
                    <input
                        tabindex="2"

                        type="password"
                        class="prb-input"
                        id="password"
                        name="password"
                        inputmode="numeric"
                        autocomplete="off"
                        maxlength="8"
                    />
                </div>
                <span class="prb-error hide" id="prb-error-password">
                    A senha digitada está incorreta.
                </span>

                <#if realm.resetPasswordAllowed>
                    <a 
                        href="${url.loginResetCredentialsUrl}"
                        tabindex="4"
                        class="prb-forgot hide"
                        id="prb-forgot"
                    >
                        Esqueci minha senha
                    </a>
                </#if>
            </main>

            <footer class="prb-footer prb-container">
                <button
                    tabindex="3"
                    class="prb-button disabled"
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
