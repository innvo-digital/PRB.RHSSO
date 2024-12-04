<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <p>Você foi desconectado. Caso a sessão tenha expirado, clique <a href="${url}">aqui</a> para fazer login novamente.</p>
</@layout.registrationLayout>
