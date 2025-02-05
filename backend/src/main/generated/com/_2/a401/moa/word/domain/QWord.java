package com._2.a401.moa.word.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QWord is a Querydsl query type for Word
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWord extends EntityPathBase<Word> {

    private static final long serialVersionUID = 1170723723L;

    public static final QWord word1 = new QWord("word1");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> level = createNumber("level", Integer.class);

    public final StringPath meaning = createString("meaning");

    public final StringPath word = createString("word");

    public QWord(String variable) {
        super(Word.class, forVariable(variable));
    }

    public QWord(Path<? extends Word> path) {
        super(path.getType(), path.getMetadata());
    }

    public QWord(PathMetadata metadata) {
        super(Word.class, metadata);
    }

}

