import React from "react";
import styled from "styled-components";

interface OwnProps {
  src: string;
  srcSelected?: string;
  selected?: boolean;
  onClick?: (e: Event) => void;
  width: number | string;
  height: number | string;
}

type Props = OwnProps;

const Icon = styled.img`
  width: 100%;
  height: 100%;
  border: none;
`;

const IconWrapper = styled.div`
  width: ${(props: Props): number | string => {
    return props.width;
  }};
  height: ${(props: Props): number | string => {
    return props.height;
  }};
`;

const IconButton = ({ src, width, height, onClick, selected, srcSelected }: Props): JSX.Element => {
  return (
    <IconWrapper onClick={onClick} width={width} height={height}>
      <Icon src={selected  ? srcSelected : src}></Icon>
    </IconWrapper>
  );
};

export default IconButton;
