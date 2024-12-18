package br.com.paranabanco.keycloak.authenticator.api;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Random;

import org.jboss.logging.Logger;
import org.keycloak.models.UserModel;
import br.com.paranabanco.keycloak.authenticator.api.SMSlogger;
import org.keycloak.models.AuthenticatorConfigModel;
public class SMSSendVerify {

	public SMSSendVerify() {
	}
	public void sendSMS(String celular, String cpf, UserModel user,String url, Boolean validarPessoaTelefone,AuthenticatorConfigModel config) {
		Random rand = new Random();
		String code = String.format("%05d", rand.nextInt(10000));
		SMSParams data = new SMSParams();
		String ddd = celular.substring(0,2);
		String numeroCelular = celular.substring(2,celular.length());

		data.setAttribute("codigo", code.toString());
		data.setAttribute("cpf", cpf.toString());
		data.setAttribute("ddd", ddd.toString());
		data.setAttribute("numeroCelular", numeroCelular.toString());
		data.setAttribute("validarPessoaTelefone", validarPessoaTelefone);
		user.removeAttribute("ultimo_token");
		user.setSingleAttribute("ultimo_token", code);
		request(data,code,url,config);
	}

	private void request(SMSParams data,String code,String _url,AuthenticatorConfigModel config) {
		if (data == null) {
			return;
		}
		SMSlogger.Log(String.format("Method [request] {0}",_url),config );
		SMSlogger.Log(String.format("Method [request] {0}",data.toJSON()),config);
		HttpURLConnection conn;
		InputStream in = null;
		BufferedReader reader = null;
		try {
			URL url = new URL(_url);
			conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Accept", "*/*");
			conn.setRequestProperty("Content-Type", "application/json");
			OutputStream os = null;
			BufferedWriter output = null;
			try {
				os = conn.getOutputStream();
				output = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
				output.write(data.toJSON());
				output.flush();
				output.close();
			} catch (IOException e) {
				SMSlogger.Log(e.getMessage(),config);
			} finally {
				if (output != null) {
					try {
						output.close();
					} catch (IOException e) {
						SMSlogger.Log(e.getMessage(),config);
					}
				}
			}
			
			final int resStatus = conn.getResponseCode();
			SMSlogger.Log(String.format("RESPONSE STATUS : {0}", resStatus),config);

			if (resStatus == HttpURLConnection.HTTP_OK) {
				in = conn.getInputStream();
				reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));

				String line;
				while ((line = reader.readLine()) != null) {
					SMSlogger.Log(String.format("RESPONSE DETAIL : {0}", line),config);
				}
			}

		} catch (IOException e) {
			SMSlogger.Log(e.getMessage(),config);
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					SMSlogger.Log(e.getMessage(),config);
				}
			}
			if (reader != null) {
				try {
					reader.close();
				} catch (IOException e) {
					SMSlogger.Log(e.getMessage(),config);
				}
			}
		}
	}
}
