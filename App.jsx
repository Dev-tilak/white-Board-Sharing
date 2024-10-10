
import { useEffect, useState } from 'react';
import './App.css'
import Forms from './components/Forms';
import RoomPage from './Pages/RoomPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import io from "socket.io-client";


const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server , connectionOptions);

const App=()=> {


  const [user , setUser] = useState(null);
  const [users , setUsers] = useState([]);
  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("userIsJoined");
        setUsers(data.users);
      } else {
        console.log("userIsJoined error");
      }
    });

    socket.on("allusers",(data)=>{
      setUsers(data);
    });

    socket.on("newUserJoinedMessageBroadcast",(data)=>{
      toast.info(`${data} joined the room`,{position:toast.POSITION.TOP_CENTER});
    });

    socket.on("userLeftMessageBroadcasted",(data)=>{
      toast.info(`${data} left the room`,{position:toast.POSITION.TOP_CENTER});
    });

  },[]);


  const uuid =()=>{
    let s4 =()=>{
      return Math.floor((1+Math.random())*0x10000).toString(16).substring(1);
    };
    return (s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()
  );
  };
  

  return (

    
      <div className="container">
        <ToastContainer />
        <Router>
        <Routes>
        <Route path="/" element={<Forms uuid = {uuid} socket={socket} setUser={setUser} />} />
        <Route path="/:roomID" element={<RoomPage user={user} socket={socket} users={users} />} />
        </Routes>

        </Router>
        
     

      </div>
      
    
  );
};

export default App;
