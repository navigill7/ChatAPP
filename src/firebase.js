import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCfjjqyTo-wcqh4ETQrAfW1gljgkjywCOU",
  authDomain: "devcodechatapp.firebaseapp.com",
  projectId: "devcodechatapp",
  storageBucket: "devcodechatapp.appspot.com",
  messagingSenderId: "338123055913",
  appId: "1:338123055913:web:3ef327506b676df9958d38"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);