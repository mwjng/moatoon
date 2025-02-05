package com._2.a401.moa.word.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWordExample is a Querydsl query type for WordExample
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWordExample extends EntityPathBase<WordExample> {

    private static final long serialVersionUID = 267768671L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWordExample wordExample = new QWordExample("wordExample");

    public final StringPath example = createString("example");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QWord word;

    public QWordExample(String variable) {
        this(WordExample.class, forVariable(variable), INITS);
    }

    public QWordExample(Path<? extends WordExample> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWordExample(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWordExample(PathMetadata metadata, PathInits inits) {
        this(WordExample.class, metadata, inits);
    }

    public QWordExample(Class<? extends WordExample> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.word = inits.isInitialized("word") ? new QWord(forProperty("word")) : null;
    }

}

