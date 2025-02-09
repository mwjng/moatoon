package com._2.a401.moa.member.dto.response;

import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.domain.MemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@AllArgsConstructor
public class MemberInfoResponse {
    private Long id;
    private String loginId;
    private String name;
    private String nickname;
    private String imageUrl;
    private String email;
    private MemberRole role;
    private List<ChildInfo> childrenList;

    public static MemberInfoResponse ofManager(Member manager, List<Member> children) {
        return MemberInfoResponse.builder()
                .id(manager.getId())
                .loginId(manager.getLoginId())
                .name(manager.getName())
                .nickname(manager.getNickname())
                .imageUrl(manager.getImageUrl())
                .email(manager.getEmail())
                .role(manager.getRole())
                .childrenList(children.stream().map(ChildInfo::from).collect(Collectors.toList()))
                .build();
    }

    public static MemberInfoResponse ofChild(Member child) {
        return MemberInfoResponse.builder()
                .id(child.getId())
                .loginId(child.getLoginId())
                .name(child.getName())
                .nickname(child.getNickname())
                .imageUrl(child.getImageUrl())
                .email(null)
                .role(child.getRole())
                .childrenList(null)
                .build();
    }
}
