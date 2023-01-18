import roomUserCard, {RoomUserCardProps} from '../../molecules/room-user-card/room-user-card'
import { UserEntity } from "../../../redux/db/user/slice";
export interface userArrangementProps {
    currentUser: UserEntity | null;
  }