import { io } from "socket.io-client";
import { BASE } from "./constants/endpoints";

const ENDPOINT = BASE;
const socket = io(ENDPOINT);

export default socket;
