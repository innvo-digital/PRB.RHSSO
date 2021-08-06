package br.com.paranabanco.keycloak.authenticator.api;
import br.com.paranabanco.keycloak.authenticator.SMSAuthenticator;
import java.util.HashMap;
import java.util.Map;
import org.keycloak.models.AuthenticatorConfigModel;
import org.json.JSONObject;
import org.jboss.logging.Logger;

public class SMSlogger {

    private static final Logger logger = Logger.getLogger(SMSlogger.class.getPackage().getName());
    public static void Log(String conteudo ){
        logger.infov(conteudo);
    }
    public static void Log(String conteudo,AuthenticatorConfigModel config ){
		if (config != null && config.getConfig() != null) {
            Boolean value  = Boolean.valueOf( config.getConfig().get("HABILITAR_LOG_CONSOLE_POD"));
            if(value){
                logger.infov(conteudo);
            }
		}
    }
}