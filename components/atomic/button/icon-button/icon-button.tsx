import React, { CSSProperties } from "react";
import styled from "styled-components";

interface OwnProps {
  src: string;
  onClick?: (e: Event) => void;
  width: number | string;
  height: number | string;
}

type Props = OwnProps & CSSProperties;

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

const IconButton = ({ src, width, height, onClick, backgroundColor }: Props): JSX.Element => {
  return (
    <IconWrapper onClick={onClick} width={width} height={height} style={{
      backgroundColor
    }}>
      <Icon src={src}></Icon>
    </IconWrapper>
  );
};

export default IconButton;
