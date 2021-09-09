# Configuração para o login

Dentro das configurações do Docker, va na opção `Docker Engine` e adicione o comando

```
"insecure-registries": [
    "registry.redhat.io"
]
```

# Comandos para executar a imagem após o login

```
docker build --tag rhsso .
docker run --name teste --publish 8080:8080 --mount type=bind,source="/var/tmp/exemplo",target=/opt/eap/themes/exemplo -e SSO_ADMIN_USERNAME=admin -e SSO_ADMIN_PASSWORD=admin -i rhsso
```
