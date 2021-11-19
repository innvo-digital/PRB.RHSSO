FROM registry.access.redhat.com/ubi8:latest AS build
USER root
RUN yum install dos2unix -y
WORKDIR /src
COPY sso-extensions.cli .

ENV SET_CONTAINER_TIMEZONE=true CONTAINER_TIMEZONE=America/Sao_Paulo TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY mssql-jdbc-9.2.1.jre11.jar .
COPY /keycloak-sms-authenticator/target/br.com.paranabanco.keycloak-sms-authenticator-4.5.0.Final-SNAPSHOT.jar .
RUN ls -la
RUN dos2unix sso-extensions.cli


FROM registry.redhat.io/rh-sso-7/sso74-openshift-rhel8:7.4 AS final
WORKDIR /opt/eap/extensions/
COPY --from=build /src .

#para cada template colocar em uma pasta destino diferente
COPY /exemplo/ /opt/eap/themes/exemplo/
RUN true
COPY /prb-login/ /opt/eap/themes/prb-login/
RUN true
COPY /keycloak-sms-authenticator/themes/paranabanco/ /opt/eap/themes/paranabanco-sms-auth/
RUN true
COPY /keycloak-sms-authenticator/target/br.com.paranabanco.keycloak-sms-authenticator-4.5.0.Final-SNAPSHOT.jar .
RUN true
COPY /keycloak-sms-authenticator/target/br.com.paranabanco.keycloak-sms-authenticator-4.5.0.Final-SNAPSHOT.jar /opt/eap/standalone/deployments/