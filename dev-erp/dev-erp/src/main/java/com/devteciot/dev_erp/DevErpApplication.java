package com.devteciot.dev_erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class DevErpApplication {

	public static void main(String[] args) {
		SpringApplication.run(DevErpApplication.class, args);
	}

}
