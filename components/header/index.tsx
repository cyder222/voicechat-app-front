import { useRouter } from "next/router";
import { VFC } from "react";
import { UserState } from "../../redux/db/user/slice";
import styles from "../../styles/header.module.css";

export interface HeaderProps {
    userState?: UserState;
}
export const HeaderComponent: VFC<HeaderProps> = (props: HeaderProps) => {
    const router = useRouter();
    return (<>
        <div className={styles.headerContainer}>
            <div className="header-logo"></div>
            { props.userState?.name && <div className="header-user-info">
                {props.userState.name}
            </div>
            }
            {!props.userState?.id && <div className="header-signin-block">
                <button onClick={():void=> {router.push("/loging");}}>aiueo</button>
            </div>}
        </div>
      </>);
};
