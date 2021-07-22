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
docker run --name teste --publish 8080:8080 --mount type=bind,source="/Volumes/SSDB/SERVER/parana-banco/PrbKeycloak/exemplo",target=/opt/eap/themes/exemplo -i rhsso
```