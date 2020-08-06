import { combineReducers } from 'redux';
import novels from './novels';
import popup from './popup';
import alert from './alert';
import user from './user';

export default combineReducers({ popup, alert, novels, user });
