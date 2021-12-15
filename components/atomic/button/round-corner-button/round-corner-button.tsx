import React from "react";
import styled from "styled-components";

interface OwnProps {
  text: string;
  onClick?: (e: Event) => void;
  width: number | string;
  height: number | string;
}

type Props = OwnProps;

const RoundCornerBtn = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #ea4c89;
  font-size: 18px;
  font-weight: bold;
  border: none;
  color: #fff;
  width: ${(props: Props): string | number => {
    return props.width;
  }};
  height: ${(props: Props): string | number => {
    return props.height;
  }};
`;

const RoundCornerButton = ({ text, width, height, onClick }: Props): JSX.Element => {
  return (
    <RoundCornerBtn onClick={onClick} width={width} height={height}>
      {text}
    </RoundCornerBtn>
  );
};

export default RoundCornerButton;
