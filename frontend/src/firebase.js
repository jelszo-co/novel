import firebase from 'firebase/app';
import 'firebase/auth';

console.log(process.env);

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'novel-ee9fb.firebaseapp.com',
  databaseURL: 'https://novel-ee9fb.firebaseio.com',
  projectId: 'novel-ee9fb',
  storageBucket: 'novel-ee9fb.appspot.com',
  messagingSenderId: '785127246699',
  appId: '1:785127246699:web:e5c7bfb8cfb0ec52c45a2e',
};

firebase.initializeApp(config);

export const auth = firebase.auth;
