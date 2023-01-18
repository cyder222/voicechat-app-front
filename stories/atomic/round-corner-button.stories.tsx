import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {default as RoundCornerButton}  from '../../components/atomic/button/round-corner-button/round-corner-button';

export default {
    text: "RoundCornerButton",
  
    component: RoundCornerButton,
    // ComponentMetaは コンポーネントのストーリーが、引数をプロップとして受け取る単純なコンポーネントで使用します。
  } as ComponentMeta<typeof RoundCornerButton>;

  const Template: ComponentStory<typeof RoundCornerButton> = (args) => <RoundCornerButton {...args} />;


export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  text: 'Button',
};
