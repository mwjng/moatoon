package com._2.a401.moa.party.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPartyMember is a Querydsl query type for PartyMember
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPartyMember extends EntityPathBase<PartyMember> {

    private static final long serialVersionUID = 786782777L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPartyMember partyMember = new QPartyMember("partyMember");

    public final com._2.a401.moa.common.auditing.QBaseEntity _super = new com._2.a401.moa.common.auditing.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com._2.a401.moa.member.domain.QMember member;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final QParty party;

    public QPartyMember(String variable) {
        this(PartyMember.class, forVariable(variable), INITS);
    }

    public QPartyMember(Path<? extends PartyMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPartyMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPartyMember(PathMetadata metadata, PathInits inits) {
        this(PartyMember.class, metadata, inits);
    }

    public QPartyMember(Class<? extends PartyMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com._2.a401.moa.member.domain.QMember(forProperty("member"), inits.get("member")) : null;
        this.party = inits.isInitialized("party") ? new QParty(forProperty("party")) : null;
    }

}

