package com.splitmate.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class StartupLogger {

    private final Environment env;

    public StartupLogger(Environment env) {
        this.env = env;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void printApplicationUrl() {
        String port = env.getProperty("local.server.port", "8080");
        String url = "http://localhost:" + port;
        System.out.println();
        System.out.println("  >>  " + url + "  <<");
        System.out.println("  Open the link above in your browser (Ctrl+Click or Cmd+Click in most terminals)");
        System.out.println();
    }
}
