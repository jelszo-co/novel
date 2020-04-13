import { combineReducers } from 'redux';
import novels from './novels';
import popup from './popup';
import user from './user';

export default combineReducers({ popup, novels, user });
