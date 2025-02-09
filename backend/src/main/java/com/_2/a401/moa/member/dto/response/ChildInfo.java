package com._2.a401.moa.member.dto.response;

import com._2.a401.moa.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ChildInfo {
    private Long id;
    private String loginId;
    private String name;
    private String nickname;
    private String imageUrl;

<<<<<<< HEAD
    public static ChildInfo from(Member child) {
=======
    public static ChildInfo of(Member child) {
>>>>>>> 0857f5e9c66554ef06612c40bb4ad333ac0c205a
        return ChildInfo.builder()
                .id(child.getId())
                .name(child.getName())
                .nickname(child.getNickname())
                .imageUrl(child.getImageUrl())
                .build();
    }
}
