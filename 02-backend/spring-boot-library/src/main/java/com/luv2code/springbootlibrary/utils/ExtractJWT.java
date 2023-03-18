package com.luv2code.springbootlibrary.utils;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtractJWT {

    public static String payloadJWTExtraction(String token, String extraction){

        token.replace("Bearer", "");

        // The logic behind the below line is to split the JWT token into three parts: header, payload and signature
        String[] chunks = token.split("\\.");

        // Decoding the JWT token and making it readable
        Base64.Decoder decoder = Base64.getUrlDecoder();

        // Decoding the token (initialized in array format)
        String payload = new String(decoder.decode(chunks[1]));

        String[] entries = payload.split(",");

        Map<String, String> map = new HashMap<>();

        for(String entry: entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);
            }
        }

        if(map.containsKey(extraction)){
            return map.get(extraction);
        }
        return null;
    }
}
