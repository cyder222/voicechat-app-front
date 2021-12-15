import { useRouter } from "next/router";
import { VFC } from "react";
import styled from "styled-components";
import { UsersState } from "../../../redux/db/user/slice";
import IconButton from "../../atomic/button/icon-button/icon-button";
import SearchInput from "../../molecules/search-input/search-input";

export interface HeaderProps {
  userState?: UsersState;
}

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;
const LogoBlock = styled.div`
  width: 138px;
  height: 35px;
  margin: 0;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

const InfoBlockItem = styled.div`
  padding: 0px;
  margin: 0 0 0 16px;
  &:first-child {
    margin: 0;
  }
`;

export const HeaderComponent: VFC<HeaderProps> = (props: HeaderProps) => {
  const router = useRouter();
  return (
    <>
      <HeaderWrapper>
        <LogoBlock>
          <img src="/img/logo.svg"></img>
        </LogoBlock>

        <InfoBlock>
          <InfoBlockItem>
            <SearchInput
              placeholder="search"
              onSubmit={(val: string):void => {
                alert(val);
              }}
            ></SearchInput>
          </InfoBlockItem>
          <InfoBlockItem>
            <IconButton width="24px" height="24px" src="/img/setting_btn.svg"></IconButton>
          </InfoBlockItem>
          {props.userState?.name && <div className="header-user-info">{props.userState.name}</div>}
          <InfoBlockItem>
            {!props.userState?.id && (
              <div className="header-signin-block">
                <button
                  onClick={(): void => {
                    router.push("/loging");
                  }}
                >
                  aiueo
                </button>
              </div>
            )}
          </InfoBlockItem>
        </InfoBlock>
      </HeaderWrapper>
    </>
  );
};
