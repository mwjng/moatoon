package com._2.a401.moa.audio.controller;

import com._2.a401.moa.audio.domain.AudioType;
import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Random;

import static com._2.a401.moa.common.exception.ExceptionCode.INVALID_AUDIO_TYPE;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    private final Random random = new Random();

    private String getRandomFileName(AudioType type) {
        List<String> fileNames = switch (type) {
            case ONE_LEFT -> List.of(
                    "11.이제_마무리해볼까.mp3",
                    "12.거의_다_왔어.mp3",
                    "13.다_했으면_완성_버튼을_누를_수_있어.mp3"
            );
            case FIVE_LEFT -> List.of(
                    "08.정말_최고야.mp3",
                    "09.잘하고있어.mp3",
                    "10.5분_남았어.mp3"
            );
            case TEN_LEFT -> List.of(
                    "05.오_좋은데_멋진_그림이잖아",
                    "06.오_멋진데.mp3",
                    "07.오_대단해.mp3"
            );
            default -> throw new MoaException(INVALID_AUDIO_TYPE);
        };

        return fileNames.get(random.nextInt(fileNames.size()));
    }

    @GetMapping("/page/{audioType}")
    public ResponseEntity<Resource> getPageAudio(@PathVariable String audioType) {
        AudioType type = AudioType.valueOf(audioType.toUpperCase());
        String fileName = type.isRandomType() ? getRandomFileName(type) : type.getFileName();
        Resource audioResource = new ClassPathResource("static/audio/" + fileName);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("audio/mpeg"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(audioResource);
    }
}