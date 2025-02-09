package com._2.a401.moa.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;
    private final RestTemplate restTemplate = new RestTemplate(); // URL에서 파일 다운로드


    @Value("${S3_BUCKET}")
    String bucket;

    public String upload(MultipartFile file) {
        String fileName = generateFileName(file);
        try {
            Path tempFile = Files.createTempFile(fileName, ".tmp");
            file.transferTo(tempFile);

            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromFile(tempFile));

            String fileUrl = "https://" + bucket + ".s3.amazonaws.com/" + fileName;

            Files.delete(tempFile);

            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }
    }

    private String generateFileName(MultipartFile file) {
        return UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
    }

    public String uploadFromUrl(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            InputStream inputStream = url.openStream();

            // 파일명 생성
            String fileName = "cover_" + UUID.randomUUID().toString() + ".png";
            Path tempFile = Files.createTempFile(fileName, ".png");
            Files.copy(inputStream, tempFile);

            // S3 업로드
            s3Client.putObject(PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileName)
                            .contentType("image/png")
                            .build(),
                    RequestBody.fromFile(tempFile));

            // 최종 URL 반환
            String fileUrl = "https://" + bucket + ".s3.amazonaws.com/" + fileName;

            // 임시 파일 삭제
            Files.delete(tempFile);

            return fileUrl;
        } catch (IOException e) {
            throw new RuntimeException("이미지 다운로드 및 업로드 실패", e);
        }
    }
}
