package com.example.demo.utility;

import java.time.Year;
import java.util.UUID;

public class CertificateNumberGenerator {
    
    public static String generate() {
        return "BC-" + Year.now() + "-" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
