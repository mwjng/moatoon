package com._2.a401.moa.party.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QParty is a Querydsl query type for Party
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QParty extends EntityPathBase<Party> {

    private static final long serialVersionUID = 886189759L;

    public static final QParty party = new QParty("party");

    public final com._2.a401.moa.common.auditing.QBaseEntity _super = new com._2.a401.moa.common.auditing.QBaseEntity(this);

    public final StringPath bookCover = createString("bookCover");

    public final StringPath bookTitle = createString("bookTitle");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DatePath<java.time.LocalDate> endDate = createDate("endDate", java.time.LocalDate.class);

    public final NumberPath<Integer> episodeCount = createNumber("episodeCount", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath introduction = createString("introduction");

    public final BooleanPath isPublic = createBoolean("isPublic");

    public final NumberPath<Integer> level = createNumber("level", Integer.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final StringPath pinNumber = createString("pinNumber");

    public final NumberPath<Integer> progressCount = createNumber("progressCount", Integer.class);

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final EnumPath<PartyState> status = createEnum("status", PartyState.class);

    public QParty(String variable) {
        super(Party.class, forVariable(variable));
    }

    public QParty(Path<? extends Party> path) {
        super(path.getType(), path.getMetadata());
    }

    public QParty(PathMetadata metadata) {
        super(Party.class, metadata);
    }

}

