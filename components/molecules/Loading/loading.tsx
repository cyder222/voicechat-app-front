import React, { ReactNode, memo } from "react";
import styled from "styled-components";

interface OwnProps {
  visible: boolean;
  children: ReactNode;
  whiteout?: boolean;
}

type Props = OwnProps;

interface LoadingWrapperProps {
  whiteout?: boolean;
}

const LoadingComponent = memo(({ visible, whiteout = true, children }: Props) => {
  return (
    <div>
      {visible && (
        <LoaderWrapper whiteout={whiteout}>
          <LoadingSpinner></LoadingSpinner>
        </LoaderWrapper>
      )}
      {children && <div>{children}</div>}
    </div>
  );
});

LoadingComponent.displayName = "loading component";
export default LoadingComponent;

const LoaderWrapper = styled.div`
    transparent: ${(props: LoadingWrapperProps): string => {
      return props.whiteout ? "50%" : "0";
    }}
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: black;
    transition: all 1s;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
`;

const LoadingSpinner = styled.div`
  // 中のローディングアニメ
  .loader,
  .loader:before,
  .loader:after {
    background: #ffffff;
    animation: loading 1s infinite ease-in-out;
    width: 1em;
    height: 4em;
  }

  .loader {
    color: #ffffff;
    text-indent: -9999em;
    margin: 88px auto;
    position: relative;
    font-size: 11px;
    transform: translateZ(0);
    animation-delay: -0.16s;

    &::before,
    &::after {
      position: absolute;
      top: 0;
      content: "";
    }

    &::before {
      left: -1.5em;
      animation-delay: -0.32s;
    }

    &::after {
      left: 1.5em;
    }
  }
  @-webkit-keyframes loading {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }

    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }

  @keyframes loading {
    0%,
    80%,
    100% {
      box-shadow: 0 0;
      height: 4em;
    }

    40% {
      box-shadow: 0 -2em;
      height: 5em;
    }
  }
`;
