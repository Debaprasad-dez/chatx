import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyAoVQwojU3bYk-w1r5Q09_vvI0_GOqr5fg",
  authDomain: "chatx-91d69.firebaseapp.com",
  databaseURL: "https://chatx-91d69.firebaseio.com",
  projectId: "chatx-91d69",
  storageBucket: "chatx-91d69.appspot.com",
  messagingSenderId: "291543146842",
  appId: "1:291543146842:web:772b017bc93c8b79485363",
  measurementId: "G-T2EL5M29G7"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="">

      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle=()=>{
    const provider=new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle} >Sign in with Google</button>
  )
}


function SignOut() {
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()} >Sign Out</button>
  )
}


function ChatRoom() {

  const dummy= useRef()

  const messagesRef=firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue,setFormValue] = useState('');

  const sendMessage=async(e)=>{
    e.preventDefault();

    const {uid,photoURL}=auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({behaviour: 'smooth'});
  }

  return(
    <>
      <main>
        {messages && messages.map(msg=> <ChatMessage key={msg.id} message={msg}/>)}
        <div ref={dummy}></div>
      </main>
      <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
      <button type='submit'>send</button>
      </form>
    </>
  )
}



function ChatMessage(props) {

  const {text, uid, photoURL}= props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent': 'recieved';

  return (
    <div className={`message ${messageClass}`}>
    <img src={photoURL} />
    <p>{text}</p>
    </div>
  )
}





export default App;
