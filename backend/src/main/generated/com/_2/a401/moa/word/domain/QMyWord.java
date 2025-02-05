package com._2.a401.moa.word.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMyWord is a Querydsl query type for MyWord
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMyWord extends EntityPathBase<MyWord> {

    private static final long serialVersionUID = -493780201L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMyWord myWord = new QMyWord("myWord");

    public final com._2.a401.moa.common.auditing.QBaseEntity _super = new com._2.a401.moa.common.auditing.QBaseEntity(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Integer> failCount = createNumber("failCount", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final com._2.a401.moa.member.domain.QMember member;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedAt = _super.modifiedAt;

    public final QWord word;

    public QMyWord(String variable) {
        this(MyWord.class, forVariable(variable), INITS);
    }

    public QMyWord(Path<? extends MyWord> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMyWord(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMyWord(PathMetadata metadata, PathInits inits) {
        this(MyWord.class, metadata, inits);
    }

    public QMyWord(Class<? extends MyWord> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com._2.a401.moa.member.domain.QMember(forProperty("member"), inits.get("member")) : null;
        this.word = inits.isInitialized("word") ? new QWord(forProperty("word")) : null;
    }

}

