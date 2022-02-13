import { TextareaAutosize } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import React, { VFC } from "react";
import { getVoiceChatApi } from "../../../api-fetch";
import LoginController from "../../auth/login-controller";

export interface createRoomDialogProps {
  buttonText: string;
  callBackAfterCreateRoom?: (roomId: string, error?: Error) => void;
}

const CreateRoomDialogModule: VFC<createRoomDialogProps> = (props: createRoomDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [roomName, setRoomName] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [roomDescription, setRoomDescription] = React.useState("");

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

  const handleRoomDescriptionChange = (event: any): void => {
    setRoomDescription(event.target.value);
  };

  const handleCategoryChange = (event: any): void => {
    setCategory(event.target.value);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createRoom = async (event: any): Promise<void> => {
    event.preventDefault();
    if (LoginController.getInfomation().authToken == null) {
      router.push("/logging/");
      return;
    }
    const apiKey: string = LoginController.getInfomation().authToken!;
    const api = getVoiceChatApi(apiKey);
    const room = await api.postRooms({ roomCreateOrUpdateBody: { title: roomName, categoryId: 1 } });
    if (room) {
      room.roomIdentity && props.callBackAfterCreateRoom && props.callBackAfterCreateRoom(room.roomIdentity);
    } else {
      props.callBackAfterCreateRoom && props.callBackAfterCreateRoom("", new Error("failed to make new room"));
    }
    handleClose();
  };

  return (
    <div>
      <FormControl variant="outlined">
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          {props.buttonText}
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">部屋を作成します</DialogTitle>
          <form onSubmit={createRoom}>
            <DialogContent>
              <h3>部屋の名前</h3>
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
              <h3>部屋の詳細</h3>
              <TextareaAutosize
                id="description"
                rowsMin={4}
                placeholder="部屋の詳細"
                onChange={handleRoomDescriptionChange}
                value={roomName}
              />
              <h3>部屋のカテゴリ</h3>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={category}
                onChange={handleCategoryChange}
                label="Age"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={(): void => {
                  handleClose();
                }}
                color="primary"
              >
                キャンセル
              </Button>
              <Button type="submit" color="primary">
                部屋を作る
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </FormControl>
    </div>
  );
};

export default CreateRoomDialogModule;
