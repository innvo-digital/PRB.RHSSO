package br.com.paranabanco.keycloak.authenticator.api;
import br.com.paranabanco.keycloak.authenticator.SMSAuthenticator;
import java.util.HashMap;
import java.util.Map;
import org.keycloak.models.AuthenticatorConfigModel;
import org.json.JSONObject;
import org.jboss.logging.Logger;

public class SMSlogger {

    private  Logger logger = Logger.getLogger(SMSAuthenticator.class.getPackage().getName());

	public SMSlogger() {
        logger = Logger.getLogger(SMSAuthenticator.class.getPackage().getName());
	}
    public void Log(String conteudo ){
        logger.infov(conteudo);
    }
    public void Log(String conteudo,AuthenticatorConfigModel config ){
        String value = null;
		if (config.getConfig() != null) {
			value = config.getConfig().get("HABILITAR_LOG_CONSOLE_POD");
            logger.infov(conteudo);
		}
    }
}