package com.example.jwt.config;

//Import the required packages



import java.util.Map;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", " dmehqtqpv",
                "api_key", "337377338445757",
                "api_secret", "MnxgIeLXk1ga23crCdjAtVYuP7w"
        ));
    }
}

