package com.example.jwt.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {

    // Upload file (image/video/pdf) to Cloudinary
    Map uploadFile(MultipartFile file, String folder) throws Exception;

    // Upload base64 data
    Map uploadFileBase64(String base64Data, String folder) throws Exception;

    // Delete file from Cloudinary using publicId
    Map delete(String publicId) throws Exception;
}
