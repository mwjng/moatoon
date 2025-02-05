package com._2.a401.moa.party.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPartyKeyword is a Querydsl query type for PartyKeyword
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPartyKeyword extends EntityPathBase<PartyKeyword> {

    private static final long serialVersionUID = 1152139818L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPartyKeyword partyKeyword = new QPartyKeyword("partyKeyword");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QKeyword keyword;

    public final QParty party;

    public QPartyKeyword(String variable) {
        this(PartyKeyword.class, forVariable(variable), INITS);
    }

    public QPartyKeyword(Path<? extends PartyKeyword> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPartyKeyword(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPartyKeyword(PathMetadata metadata, PathInits inits) {
        this(PartyKeyword.class, metadata, inits);
    }

    public QPartyKeyword(Class<? extends PartyKeyword> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.keyword = inits.isInitialized("keyword") ? new QKeyword(forProperty("keyword")) : null;
        this.party = inits.isInitialized("party") ? new QParty(forProperty("party")) : null;
    }

}

