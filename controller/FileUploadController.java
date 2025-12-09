package com.example.jwt.controller;



import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // ✅ React CORS allow
@RestController
@RequestMapping("/api")
public class FileUploadController {

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/upload")
    public Map<String, String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type
    ) throws IOException {

        Map<String, Object> options = new HashMap<>();

        if ("video".equals(type)) {
            options.put("resource_type", "video");
        } else {
            options.put("resource_type", "raw"); // ✅ PDF
        }

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                options
        );

        Map<String, String> response = new HashMap<>();
        response.put("url", uploadResult.get("secure_url").toString());
        response.put("public_id", uploadResult.get("public_id").toString());

        return response;
    }
}
