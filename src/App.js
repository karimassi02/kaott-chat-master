import './App.css';
import firebaseConfig from './private.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {addDoc, collection, getFirestore, orderBy, query} from 'firebase/firestore'
import { useEffect, useState } from 'react';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app)
// const analytics = getAnalytics(app);


function App() {
const [user] = useAuthState(auth)
  return (
  <div className="App">
    <header>
    <h1> Kaott ChatBox </h1>
    <Logout/>
      
    </header>

    <section>
    { user ?   <Chat/> : <Login/> }
    </section>
  </div>

  );
}

function Login() {
  const googleSignIn = ()  => {
    const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
 }

return (
  <>
<button onClick={googleSignIn}> Sign in with Google </button>
</>
)
}

function Logout() {
const googleSignOut = () => { signOut (auth)}
return (
  
  auth.currentUser && <> <button onClick={googleSignOut}> Sign Out </button> </>
  
 
)
}



function Chat(){
const msgCollection = collection(firestore, "messages")
const q = query(msgCollection, orderBy('timestamp'))

const [messages] = useCollectionData(q)

const [myMessage, setMyMessage] = useState("")

useEffect(() => {
  console.log('messages', messages)
},[messages])

const sendMessage = (event) => {
  event.preventDefault()
  
  const currentUser = auth.currentUser

  addDoc(msgCollection, {
    text: myMessage,
    timestamp: Date.now(),
    userId: currentUser.uid,
    avatar: currentUser.photoURL

  })
}

return (
<>
<main className='chatroom'>
{ messages && messages.map(msg => (
  <li>
  <Message key ={msg.timestamp} message = {msg}/>
  </li>
))}
</main>

<form onSubmit={sendMessage}>

<input type='text' placeholder='Say Hi!' 
  value={myMessage} onChange={e => setMyMessage(e.target.value)} />
<button type='submt'> Send </button>
</form>

</>

)

}


function Message(props) {

  const { text, avatar, userId} = props.message
  const msgClass = userId === auth.currentUser.uid ? "message--sent" : "message--received"

return (
  <>
  <div className= { `message ${msgClass}`}>
    <img alt="Avatar" src={ avatar || "https://avatars.dicebear.com/4.5/api/human/reyact-chat.svg?w=96&h=96"}></img>
    <p> {props.message.text}</p>
  </div>
  </>

)
}


export default App