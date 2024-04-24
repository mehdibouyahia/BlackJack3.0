import styled from "styled-components";

import { Color } from "../../assets/constants";

export const SpotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;
export const SpotStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vmax;
  width: 16vmax;
  border: 2px solid white;
  padding: 20px 0;
  position: relative;
  cursor: pointer;

  &.active {
    border: 5px solid ${Color.Lime};
  }
  &.dealer {
    border-color: transparent;
  }
  &.disabled {
    pointer-events: none;
  }
`;
export const Name = styled.div`
  position: absolute;
  font-size: 3vmin;
  top: 0;
`;

export const SpotsZone = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-between;
`;

export const CardsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CardsTotal = styled.div`
  font-size: 3vmin;
  margin-left: 4vmin;
  width: 3.5vmin;
  height: min-content;
  color: white;
  border: 0.23vmin solid white;
  text-align: center;
  border-radius: 1vmin;
  &.bust {
    border-color: ${Color.Lost};
    color: ${Color.Lost};
  }
  &.bj {
    border-color: ${Color.Won};
    color: ${Color.Won};
  }
`;

export const ChipsWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;
