package com._2.a401.moa.schedule.dto.request;

import java.util.Map;

public record SessionCreateRequest(
    Map<String, Object> sessionProperties,
    Map<String, Object> connectionProperties
){
}
