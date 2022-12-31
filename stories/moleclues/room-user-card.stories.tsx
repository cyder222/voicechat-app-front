import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {default as RoomUserCard, RoomUserCardProps}  from '../../components/molecules/room-user-card/room-user-card';
import { userSelector } from '../../redux/db/user/selectors';

export default {
    text: "RoomUserCard",
  
    component: RoomUserCard,
    // ComponentMetaは コンポーネントのストーリーが、引数をプロップとして受け取る単純なコンポーネントで使用します。
  } as ComponentMeta<typeof RoomUserCard>;

  const Template: ComponentStory<typeof RoomUserCard> = (args) => <RoomUserCard {...args} />;

  
export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

const args: RoomUserCardProps = {
    user: {
      id: 1,
      uid: "unique_name",
      name: "test_name",
      },
      volume: 1.0,
      isMute: false,
      stream: null,
      isVoicing: false,
      playState: "stop",
      width: "200px",
      height: "200px",
      image: null,
    };
Primary.args = args;
