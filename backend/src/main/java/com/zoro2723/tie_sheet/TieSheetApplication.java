package com.zoro2723.tie_sheet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.awt.*;
import java.net.URI;

@SpringBootApplication
public class TieSheetApplication {

	public static void main(String[] args) {
		SpringApplication.run(TieSheetApplication.class, args);
	}

    // This will run after the Spring Boot app starts
    @Bean
    public CommandLineRunner openBrowser() {
        return args -> {
            String url = "http://localhost:8080"; // your static page URL
            if (Desktop.isDesktopSupported()) {
                Desktop.getDesktop().browse(new URI(url));
            } else {
                System.out.println("Please open your browser and go to " + url);
            }
        };
    }

}
