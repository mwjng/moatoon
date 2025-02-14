package com._2.a401.moa.schedule.repository;

import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.schedule.domain.SessionMember;
import org.springframework.data.repository.CrudRepository;

import static com._2.a401.moa.common.exception.ExceptionCode.SESSION_NOT_FOUND;

public interface SessionMemberRedisRepository extends CrudRepository<SessionMember, Long> {

    default SessionMember fetchByScheduleId(Long scheduleId) {
        return findById(scheduleId)
            .orElseThrow(() -> new MoaException(SESSION_NOT_FOUND));
    }
}
