package com._2.a401.moa.member.dto.response;

import com._2.a401.moa.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class SearchChildInfo {
    private Long id;
    private String loginId;
    private String name;
    private String nickname;

    public static SearchChildInfo from(Member child) {
        return SearchChildInfo.builder()
                .id(child.getId())
                .loginId(child.getLoginId())
                .name(child.getName())
                .nickname(child.getNickname())
                .build();
    }
}
