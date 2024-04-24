import React from "react";

import { Rank, Suit } from "../../assets/constants";
import { CardStyled, CardWrap } from "./Card.styled";

export const CardComponent = ({ suit, rank, id, isHidden = false }) => {
  const shortRank = convertRank(rank);
  return (
    <CardWrap>
      {isHidden ? (
        <CardStyled className="back" id={`back-${id}`} />
      ) : (
        <CardStyled className={`face ${suit}`} id={`face-${id}`}>
          <div className="rank" data-suit={Suit[suit]}>
            {shortRank}
          </div>
          <div className="suit">{Suit[suit]}</div>
          <div className="rank" data-suit={Suit[suit]}>
            {shortRank}
          </div>
        </CardStyled>
      )}

      {/* <CardStyled className="back" id={`back-${id}`} /> */}
    </CardWrap>
  );
};

function convertRank(rank) {
  switch (rank) {
    case Rank.King:
    case Rank.Queen:
    case Rank.Jack:
    case Rank.Ace:
      return rank.charAt(0).toUpperCase();
    default:
      return rank;
  }
}
