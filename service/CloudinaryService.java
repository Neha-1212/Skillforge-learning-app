package com.example.jwt.service;



import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface CloudinaryService {
    Map uploadFile(MultipartFile file, String folder) throws Exception;
    Map uploadFileBase64(String base64Data, String folder) throws Exception;
    Map delete(String publicId) throws Exception;
}

