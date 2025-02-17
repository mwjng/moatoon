package com._2.a401.moa.schedule.domain;

import com._2.a401.moa.common.exception.MoaException;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.HashMap;
import java.util.Map;

import static com._2.a401.moa.common.exception.ExceptionCode.REDIS_SESSION_MEMBER_NOT_FOUND;

@Getter
@RedisHash(value = "sessionMember", timeToLive = 3600)
public class SessionMember {

    @Id
    private Long scheduleId;

    private Map<Long, Boolean> sessionMembers;

    private Map<Long, Boolean> quizDoneMembers; // 퀴즈 완료했는지 여부

    public SessionMember(final Long scheduleId) {
        this.scheduleId = scheduleId;
        this.sessionMembers = new HashMap<>();
        this.quizDoneMembers = new HashMap<>();
    }

    public void addMember(final Long memberId) {
        this.sessionMembers.put(memberId, false);
    }

    public void removeMember(final Long memberId) {
        this.sessionMembers.remove(memberId);
    }

    public void addQuizDoneMember(final Long memberId) {
        this.quizDoneMembers.put(memberId, true);
    }

    public int getMemberCount() {
        return sessionMembers.size();
    }

    public void setReadyStatus(final Long memberId, final boolean isReady) {
        if (!sessionMembers.containsKey(memberId)) {
            throw new MoaException(REDIS_SESSION_MEMBER_NOT_FOUND);
        }
        sessionMembers.put(memberId, isReady);
    }

    public void resetReadyStatus() {
        sessionMembers.forEach((key, value) -> sessionMembers.put(key, false));
    }

    public boolean checkAllMembersReady() {
        return sessionMembers.values().stream()
            .allMatch(isReady -> isReady);
    }

    public boolean isMemberExists(final Long memberId) {
        return sessionMembers.containsKey(memberId);
    }
}
