package com._2.a401.moa.common.s3;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
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
            BufferedImage image = ImageIO.read(new URL(imageUrl));

            String fileName = "cover_" + UUID.randomUUID() + ".png";
            Path tempFile = Files.createTempFile("upload-", ".png");
            File file = tempFile.toFile();
            ImageIO.write(image, "png", file);

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileName)
                            .contentType("image/png")
                            .build(),
                    RequestBody.fromFile(file)
            );

            Files.delete(tempFile);

            return "https://" + bucket + ".s3.amazonaws.com/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("DALL-E 이미지 다운로드 및 업로드 실패", e);
        }

    }

    public String uploadSvgString(String svgString) {
        // SVG 문자열을 InputStream으로 변환
        ByteArrayInputStream inputStream = new ByteArrayInputStream(svgString.getBytes());

        // 파일명 생성
        String fileName = generateFileNameForSvg();

        // S3에 SVG 파일 업로드
        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileName)
                            .contentType("image/svg+xml") // SVG 파일임을 지정
                            .build(),
                    RequestBody.fromInputStream(inputStream, svgString.length()) // InputStream과 파일 크기 지정
            );

            // S3 URL 생성
            return "https://" + bucket + ".s3.amazonaws.com/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("SVG 업로드 실패", e);
        }
    }

    // 파일명 생성
    private String generateFileNameForSvg() {
        return "svg-" + UUID.randomUUID() + ".svg";
    }

}
