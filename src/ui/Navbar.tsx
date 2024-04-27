import { Avatar } from '@nextui-org/react';
import { getUser } from '../constants/CONSTANTS';
import GithubIcon from './GithubIcon';
import ExitIcon from './ExitIcon';
import { RoomContext } from '../hooks/roomContext';
import { useContext } from 'react';

function Navbar({ handleOpen }: any) {
  const { roomID } = useContext(RoomContext);

  return (
    <nav className="flex justify-between bg-green-100 py-4 items-center px-4 lg:px-10 absolute w-full top-0 z-10">
      <a href="/" className="w-12 select-none hover:animate-pulse">
        <img src="/logo.svg" alt="Converse Logo" />
      </a>
      <div className="flex items-center gap-6 lg:gap-12">
        {roomID && (
          <a href="/">
            <ExitIcon />
          </a>
        )}
        <a
          href="https://github.com/Aman-in-GitHub/Converse-TalkWithPrivacy"
          target="_blank"
        >
          <GithubIcon />
        </a>

        <Avatar
          name={getUser()?.charAt(0)?.toUpperCase()}
          className={`text-2xl bg-green-500 text-white font-heading select-none cursor-pointer active:scale-95 duration-300`}
          onClick={handleOpen}
        />
      </div>
    </nav>
  );
}

export default Navbar;
