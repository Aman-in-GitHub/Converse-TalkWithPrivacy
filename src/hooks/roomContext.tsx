import React, { ReactNode, createContext, useState } from 'react';

type RoomContextValue = {
  roomID: string;
  updateRoomID: (newRoomID: string) => void;
};

export const RoomContext = createContext<RoomContextValue>({
  roomID: '',
  updateRoomID: () => {}
});
type RoomProviderProps = {
  children: ReactNode;
};

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [roomID, setRoomID] = useState('');

  const updateRoomID = (newRoomID: string) => {
    setRoomID(newRoomID);
  };

  return (
    <RoomContext.Provider value={{ roomID, updateRoomID }}>
      {children}
    </RoomContext.Provider>
  );
};
