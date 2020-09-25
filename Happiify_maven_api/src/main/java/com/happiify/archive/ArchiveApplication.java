package com.happiify.archive;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.happiify.archive.dao")
public class ArchiveApplication {
	public static void main(String[] args) {
		SpringApplication.run(ArchiveApplication.class, args);
	}
}
