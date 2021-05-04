import openSocket from 'socket.io-client';

export const initSocket = () => {
    return openSocket('http://localhost:8080');
};