package com._2.a401.moa.common.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.parameters.RequestBody;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        Schema<?> fileSchema = new Schema<>()
                .type("object")
                .addProperties("file",
                        new Schema<>()
                                .type("string")
                                .format("binary")
                );

        return new OpenAPI()
                .components(new Components()
                        .addSchemas("FileUpload", fileSchema))
                .info(new Info()
                        .title("모아 책방 API")
                        .description("공통 프로젝트 REST API 문서")
                        .version("v1.0.0"));
    }
}