import styled from "styled-components";

export const CardWrap = styled.div`
  width: 4vmax;
  height: 6.4vmax;
  font-size: 2.88vmin;
  position: relative;
  display: block;
  user-select: none;
  &:not(:first-child) {
    position: relative;
    margin-left: -2.2vw;
  }
`;
export const CardStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  padding: 0.9vmax;
  border-radius: 0.72vmax;
  pointer-events: none;
  &.Spades,
  &.Clubs {
    color: black;
  }

  &.Hearts,
  &.Diamonds {
    color: red;
  }

  &.face {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.5);
    background: #fff;
    & .suit {
      font-size: 4.5vmax;
      font-weight: 100;
    }

    & .rank {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 0.36vmax;
      display: flex;
      flex-flow: column;
      align-items: center;
      transform: scale(-1);
      line-height: 1;

      &:first-of-type {
        bottom: auto;
        right: auto;
        top: 0;
        left: 0;
        transform: none;
      }

      &::after {
        font-size: 1.26vmax;
        content: attr(data-suit);
      }
    }
  }

  &.back {
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.5);
    background: #000000;
  }
`;
