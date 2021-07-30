package br.com.paranabanco.keycloak.authenticator.api;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

public class SMSParams {

	private Map<String, Object> data;

	public SMSParams() {
		data = new HashMap<String, Object>();
	}

	public void setAttribute(String key, Object value) {
		this.data.put(key, value);
	}

	public Map<String, Object> toMap() {
		return this.data;
	}

	public String toJSON() {
		JSONObject json = new JSONObject();
		for (Map.Entry<String, Object> entry : toMap().entrySet()) {
			json.put(entry.getKey(), entry.getValue());
		}
		return json.toString();
	}
}
