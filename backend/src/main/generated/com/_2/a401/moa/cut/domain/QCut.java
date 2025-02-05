package com._2.a401.moa.cut.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QCut is a Querydsl query type for Cut
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCut extends EntityPathBase<Cut> {

    private static final long serialVersionUID = 2047949375L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QCut cut = new QCut("cut");

    public final com._2.a401.moa.common.auditing.QBaseEntity _super = new com._2.a401.moa.common.auditing.QBaseEntity(this);

    public final StringPath content = createString("content");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Integer> cutOrder = createNumber("cutOrder", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath imageUrl = createString("imageUrl");

    public final com._2.a401.moa.member.domain.QMember member;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final com._2.a401.moa.party.domain.QParty party;

    public final NumberPath<Integer> randomOrder = createNumber("randomOrder", Integer.class);

    public final com._2.a401.moa.word.domain.QWord word;

    public QCut(String variable) {
        this(Cut.class, forVariable(variable), INITS);
    }

    public QCut(Path<? extends Cut> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QCut(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QCut(PathMetadata metadata, PathInits inits) {
        this(Cut.class, metadata, inits);
    }

    public QCut(Class<? extends Cut> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com._2.a401.moa.member.domain.QMember(forProperty("member"), inits.get("member")) : null;
        this.party = inits.isInitialized("party") ? new com._2.a401.moa.party.domain.QParty(forProperty("party")) : null;
        this.word = inits.isInitialized("word") ? new com._2.a401.moa.word.domain.QWord(forProperty("word")) : null;
    }

}

