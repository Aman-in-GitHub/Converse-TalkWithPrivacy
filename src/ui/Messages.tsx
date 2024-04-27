import { useContext, useEffect, useRef, useState } from 'react';
import socket from '../socket/socket';
import { toast } from 'sonner';
import { RoomContext } from '../hooks/roomContext';

type MessageData = {
  id: string;
  name: string;
  message: string;
  time: string;
};

function Messages(): JSX.Element {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isTyping, setIsTyping] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { updateRoomID } = useContext(RoomContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleMessage = (data: MessageData) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, data];
        console.log('MSG DATA: ', data);

        return newMessages;
      });

      setIsTyping('');
    };

    const handleUserJoinedRoom = (data: string) => {
      toast.info(data);
    };

    const handleJoinAlert = (data: string) => {
      toast.success(data);
    };

    const handleUserLeftRoom = (data: string) => {
      toast.error(data);
      toast.warning(`You will be redirected to the home page shortly`);

      const timeoutId = setTimeout(() => {
        window.location.href = '/';
        updateRoomID('');
      }, 5000);

      return () => clearTimeout(timeoutId);
    };

    const handleActivity = (data: any) => {
      setIsTyping(data);

      const timeoutId = setTimeout(() => {
        setIsTyping('');
      }, 2000);

      return () => clearTimeout(timeoutId);
    };

    const handleUserDisconnected = (data: string) => {
      toast.error(data);
      toast.warning(`You will be redirected to the home page shortly`);

      const timeoutId = setTimeout(() => {
        window.location.href = '/';
        updateRoomID('');
      }, 5000);

      return () => clearTimeout(timeoutId);
    };

    socket.on('newUserAlert', handleUserJoinedRoom);
    socket.on('joinAlert', handleJoinAlert);
    socket.on('leftRoom', handleUserLeftRoom);
    socket.on('userDisconnected', handleUserDisconnected);
    socket.on('message', handleMessage);
    socket.on('activity', handleActivity);

    return () => {
      socket.off();
    };
  }, []);

  return (
    <>
      {messages?.length === 0 && (
        <p className="text-center lg:text-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full font-semibold select-none px-6 lg:px-0">
          All the messages are deleted after you leave the chat room
        </p>
      )}
      <div className="pt-4 pb-[4.5rem] lg:pb-[6.5rem] flex flex-col gap-4 px-4 lg:px-10">
        {messages.map((message) => (
          <div
            className="flex flex-col w-full max-w-[240px] lg:max-w-[420px] leading-1.5 p-4 bg-white rounded-sm"
            style={{
              alignSelf: message.id === socket.id ? 'flex-end' : 'flex-start',
              backgroundColor: message.id === socket.id ? 'white' : 'black',
              borderRadius:
                message.id === socket.id
                  ? '1rem 0rem 1rem 1rem'
                  : '0rem 1rem 1rem 1rem'
            }}
          >
            <div
              className="flex items-center space-x-2 rtl:space-x-reverse select-none"
              style={{
                alignSelf: message.id === socket.id ? 'flex-end' : 'flex-start'
              }}
            >
              <span className="font-semibold text-green-500 text-lg">
                {message.name}
              </span>
              <span className="text-xs text-[#999]">{message.time}</span>
            </div>
            <p
              className="py-2 text-xl text-wrap max-w-full break-words"
              style={{
                alignSelf: message.id === socket.id ? 'flex-end' : 'flex-start',
                color: message.id === socket.id ? 'black' : 'white'
              }}
            >
              {message.message}
            </p>
            <div ref={messagesEndRef} />
          </div>
        ))}
        {isTyping && (
          <div
            className="flex flex-col w-full max-w-[240px] lg:max-w-[320px] leading-1.5 p-4 text-white rounded-sm animate-pulse"
            style={{
              backgroundColor: 'black',
              borderRadius: '0rem 1rem 1rem 1rem'
            }}
          >
            {isTyping}
          </div>
        )}
      </div>
    </>
  );
}

export default Messages;
