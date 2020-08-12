//export all middleware
import ui from "./ui";
import api from './api';
import auth from './auth'

export default [...ui, ...api, ...auth];