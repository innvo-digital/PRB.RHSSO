package br.com.paranabanco.keycloak.authenticator;

import java.util.List;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;

import org.jboss.logging.Logger;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;
import br.com.paranabanco.keycloak.authenticator.api.SMSSendVerify;
import br.com.paranabanco.keycloak.authenticator.api.SMSlogger;

public class SMSAuthenticator implements Authenticator {

	public AuthenticatorConfigModel config;
	public void authenticate(AuthenticationFlowContext context) {
		SMSlogger.Log("Method [authenticate]",config);
	    config = context.getAuthenticatorConfig();
		UserModel user = context.getUser();
		String celular = getAttribute(user,"celular");
		String cpf = getAttribute(user,"cpf");
		String url =  getConfigString(config,"URL_HOMOLAGACAO_PRBHASH"); 
		String strUsarUrlHash = getConfigString(config,"USAR_URL_HOMOLAGACAO_PRBHASH"); 
		String usarUrlHash = getConfigString(config,"USAR_URL_HOMOLAGACAO_PRBHASH"); 
		String strValidacao = getConfigString(config,"USAR_VALIDACAO_PESSOA_CPF_TELEFONE"); 
		Boolean b1= Boolean.valueOf(strUsarUrlHash);
		Boolean b2 = Boolean.valueOf(strValidacao);
		
		if(!b1){
			url = getConfigString(config,"URL_PRODUCAO_PRBHASH");
		}
		
		SMSlogger.Log( String.format("celular {0} cpf {1} {2}", celular,cpf,url),config);

		if (celular.isBlank() == false && cpf.isBlank() == false ) {

			SMSSendVerify sendVerify = new SMSSendVerify();
			sendVerify.sendSMS(celular,cpf,user,url,b2,config);
			Response challenge = context.form().createForm("sms-validation.ftl");
			context.challenge(challenge);
			
		} else {
			Response challenge = context.form().addError(new FormMessage("missingTelNumberMessage"))
					.createForm("sms-validation-error.ftl");
			context.challenge(challenge);
		}

	}

	public void action(AuthenticationFlowContext context) {
		SMSlogger.Log("Method [action]",config);
		MultivaluedMap<String, String> inputData = context.getHttpRequest().getDecodedFormParameters();
		String enteredCode = inputData.getFirst("smsCode");
		UserModel user = context.getUser();
		String celular = getAttribute(user,"celular");
		String ultimoToken = getAttribute(user,"ultimo_token");
		String cpf = getAttribute(user,"cpf");
		SMSlogger.Log( String.format("celular {0} cpf {1}", celular,cpf),config);
		if(enteredCode.equals(ultimoToken)){
			SMSlogger.Log("verify code check : OK");
			context.success();
		}
		else {
			Response challenge = context.form()
					.setAttribute("username", context.getAuthenticationSession().getAuthenticatedUser().getUsername())
					.addError(new FormMessage("invalidSMSCodeMessage")).createForm("sms-validation-error.ftl");
			context.challenge(challenge);
		}
	}

	public boolean requiresUser() {
		SMSlogger.Log("Method [requiresUser]",config);
		return false;
	}

	public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
		SMSlogger.Log("Method [configuredFor]",config);
		return false;
	}

	public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {

	}

	public void close() {
		SMSlogger.Log("<<<<<<<<<<<<<<< SMSAuthenticator close",config);
	}

	private String getAttribute(UserModel user, String attributeName) {
		List<String> phoneNumberList = user.getAttribute(attributeName);
		if (phoneNumberList != null && !phoneNumberList.isEmpty()) {
			return phoneNumberList.get(0);
		}
		return null;
	}

	private String getConfigString(AuthenticatorConfigModel config, String configName) {
		String value = null;
		if (config.getConfig() != null) {
			value = config.getConfig().get(configName);
		}
		return value;
	}
}