import nookies from "nookies";
import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../redux/db/user/selectors";
 


// firebaseの設定キー
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// firebaseを初期化
if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

interface IAuthContextData {
  firebaseUser: FirebaseUserType | null;
}

// AuthContextを作成
export const AuthContext = createContext<IAuthContextData>({ firebaseUser: null });

/**
 * @description 認証処理を提供するコンポーネント
 */
export const AuthProvider: React.FC = ({ children }) => {
  const currentUser = useSelector(userSelector.getCurrentUser);

  // FirestoreやRealtime Databaseを使ってない場合は、以下の処理を実行する必要があります。
  // 10分ごとにトークンをリフレッシュ
   useEffect(() => {
     const handle = setInterval(async () => {
  
      const user = currentUser;
  
      if (user) await user.getIdToken(true);
  
     }, 10 * 60 * 1000);
  
    // clean up setInterval
    return () => {return clearInterval(handle);};
   }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
