import { Transition, TransitionStatus } from "react-transition-group";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

interface OwnProps {
  text: string;
  iconSrc?: string;
  iconWidth?: string;
  iconHeight?: string;
  onClick?: (e: Event) => void;
  width: number | string;
  height: number | string;
}

interface styledProps {
  state: TransitionStatus;
}

type Props = OwnProps;

type StyledProps = OwnProps & styledProps;

const RoundWaveBtn = styled.button`
  transition: ease-in 0.25s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background-color: #fff;
  font-size: 12px;
  font-weight: bold;
  border: 3px solid #ea4c89;
  color: #5b5b5b;
  width: ${(props: Props): string | number => {
    return props.width;
  }};
  height: ${(props: Props): string | number => {
    return props.height;
  }};
  outline-color: #ea4c89;
  outline-style: solid;
  outline-width: ${(props: StyledProps): string => {
    return props.state === "entered" ? "5px" : "1px";
  }};
  outline-offset: ${(props: StyledProps): string => {
    return props.state === "exited" ? "0px" : "10px";
  }};
`;

const RoundCornerButton = ({ text, width, height, onClick, iconSrc, iconWidth, iconHeight }: Props): JSX.Element => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(!animate);
    }, 500);
  }, [animate]);

  return (
    <Transition in={animate} appear={true} timeout={{ enter: 250, exit: 250 }}>
      {(state): JSX.Element => {
        return (
          <RoundWaveBtn state={state} onClick={onClick} width={width} height={height}>
            {iconSrc && iconWidth && iconHeight && <img src={iconSrc} width={iconWidth} height={iconHeight}></img>}
            {text}
          </RoundWaveBtn>
        );
      }}
    </Transition>
  );
};

export default RoundCornerButton;
