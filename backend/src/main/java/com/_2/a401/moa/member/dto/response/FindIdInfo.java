package com._2.a401.moa.member.dto.response;

import com._2.a401.moa.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class FindIdInfo {
    String loginId;

    public static FindIdInfo from(Member member) {
        return FindIdInfo.builder()
                .loginId(member.getLoginId())
                .build();
    }
}
