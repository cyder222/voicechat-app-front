import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import React, { FormEvent, VFC } from "react";
import { getVoiceChatApi } from "../../api";
import LoginController from "../auth/login-controller";

export interface createRoomDialogProps{
  buttonText: string;
  callBackAfterCreateRoom?: (roomId: string, error?: Error)=>void;
}

export const OkCancelButtonDialogComponent: VFC<createRoomDialogProps> = (props: createRoomDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState("");
  const router = useRouter();

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRoomNameChange = (event: any): void => {
    setRoomName(event.target.value);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createRoom = async (event: any): Promise<void> => {
    event.preventDefault();
    if(LoginController.getInfomation().authToken == null) {
      router.push("/login/");
      return;
    }
    const apiKey: string = LoginController.getInfomation().authToken!;
    const api = getVoiceChatApi(apiKey);
    const room = await api.postRooms(
     { roomCreateOrUpdateBody: { title: roomName, categoryId: 1 } },
    );
    if(room){
      room.roomIdentity && props.callBackAfterCreateRoom && props.callBackAfterCreateRoom(room.roomIdentity);
    }else
    {
      props.callBackAfterCreateRoom && props.callBackAfterCreateRoom("", new Error("failed to make new room"));
    }
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.buttonText}
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">部屋を作成します</DialogTitle>
        <form onSubmit={createRoom}>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="部屋の名前"
            type="  text"
            onChange={handleRoomNameChange}
            value={roomName}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void=>{
            handleClose();
            }} color="primary">
            キャンセル
          </Button>
          <Button type="submit" color="primary">
            部屋を作る
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
