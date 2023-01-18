import { useState } from 'react';
import styled from "styled-components"

class AnimationController {
    private  animationGroupId: number; 
    constructor(animationGroudId: number) {
        this.animationGroupId = animationGroudId;
    }
    public changeFlex(){

    }
}

export function useAnimationFlexbox(animationGroupId: number) {
  const flexStyles = {
    flexRow: styled.div``,
  };

  const changeFlexDirection = () =>{

  };
  const changeAnimationTime = () => {

  };

  const appendChild = (childNode: HTMLElement) => {

  }
  return [flexStyles, { changeFlexDirection, changeAnimationTime, appendChild }];
}