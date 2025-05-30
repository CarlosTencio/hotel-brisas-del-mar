import { RoomActive } from "./room-active";

export interface ManageRoomActive {

  roomTypeId: number,
  roomTypeName: string,
  roomActiveDTOs: RoomActive[],

}
