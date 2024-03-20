import { io } from 'socket.io-client';

const socket = io('https://converse-talkwithprivacy.onrender.com');

export default socket;
