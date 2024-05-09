import Messages from './Messages';
import SendIcon from './SendIcon';
import { toast } from 'sonner';
import socket from '../socket/socket';
import { getUser } from '../constants/CONSTANTS';
import { useContext, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { nanoid } from 'nanoid';
import { RoomContext } from '../hooks/roomContext';

function Chat({ isLive }: { isLive: boolean }) {
  const { roomID, updateRoomID } = useContext(RoomContext);

  useEffect(() => {
    socket.on('roomAlert', (data) => {
      toast.error(data);
    });

    socket.on('joinedRoom', (data) => {
      updateRoomID(data);
    });

    return () => {
      socket.off();
    };
  }, []);

  function handleMessageSubmit(e: any) {
    e.preventDefault();

    const value = e.target[0].value;

    if (value.trim() === '') {
      toast.error(
        <p className="font-heading text-sm lg:text-base">
          Please enter a message to send
        </p>
      );

      return;
    }

    socket.emit('message', {
      name: getUser()?.split(' ')[0],
      message: value
    });

    e.target[0].value = '';
  }

  function handleKeyPress() {
    socket.emit('activity', getUser()?.split(' ')[0]);
  }

  function createRoom() {
    const ROOM_ID = nanoid();
    navigator.clipboard.writeText(ROOM_ID);

    socket.emit('createRoom', {
      name: getUser()?.split(' ')[0],
      room: ROOM_ID
    });

    toast.info(`Room ID copied to your clipboard`);

    updateRoomID(ROOM_ID);
  }

  function handleJoinRoom(e: any) {
    e.preventDefault();

    const value = e.target[0].value;

    if (value.trim() === '') {
      toast.error(
        <p className="font-heading text-sm lg:text-base">
          Please enter a room id
        </p>
      );

      return;
    }

    socket.emit('enterRoom', {
      name: getUser()?.split(' ')[0],
      room: value
    });

    e.target[0].value = '';
  }

  return (
    <>
      <main className="h-screen pt-20 font-body bg-[url('/mobileBg.jpg')] lg:bg-[url('/bg.jpg')] bg-cover overflow-auto scrollbar-hide bg-no-repeat">
        <Messages />
        {roomID ? (
          <form
            className="flex items-center absolute bottom-0 w-full py-2 lg:py-4 border-t px-4 lg:px-10 bg-green-100"
            onSubmit={handleMessageSubmit}
          >
            <input
              type="text"
              className="w-full py-2 lg:py-3 outline-0 text-lg lg:text-2xl caret-green-500 bg-transparent selection:bg-green-500 selection:text-white"
              placeholder="Type a message"
              onChange={handleKeyPress}
            />
            <button>
              <SendIcon type="submit" />
            </button>
          </form>
        ) : (
          <form
            className="flex flex-col items-center absolute bottom-0 w-full py-2 lg:py-4 border-t px-4 lg:px-10 bg-green-100 lg:flex-row gap-4"
            onSubmit={handleJoinRoom}
          >
            <input
              type="text"
              className="w-full py-2 lg:py-3 outline-0 text-lg lg:text-2xl caret-green-500 bg-transparent selection:bg-green-500 selection:text-white lg:w-1/2"
              placeholder="Join an existing room"
              disabled={!isLive}
            />

            <Button
              radius="none"
              color="primary"
              className=" w-full lg:w-1/2 h-full py-2 lg:py-4 text-lg lg:text-xl font-heading"
              onClick={createRoom}
              disabled={!isLive}
            >
              Create a new room
            </Button>
          </form>
        )}
      </main>
    </>
  );
}

export default Chat;
