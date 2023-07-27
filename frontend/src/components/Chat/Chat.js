import React, { useEffect, useState, useRef } from "react";
import io from 'socket.io-client';
import { useParams } from "react-router-dom";
import * as IoIcons from 'react-icons/io';
import './Chat.css'
import * as SiIcons from 'react-icons/si';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Chat = ({ teacherData, studentdata }) => {
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  let username;
  let userid = "";
  const chatMessagesRef = useRef(null);

  if (teacherData) {
    username = teacherData.name;
    userid = teacherData.Teacher_id;
  }
  if (studentdata) {
    username = studentdata.name;
    userid = studentdata.enrollNum;
    console.log(userid)
  }

  useEffect(() => {
    setLoader(false);
  }, [userid]);

  const [socket, setSocket] = useState(null);
  const params = useParams();
  const classroom = params.classroom;

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { message, username, room: classroom, userid, timestamp: Date.now() });
    setMessage('');
    sendTypingStatus(false)
  };

  const sendTypingStatus = (isTyping) => {
    socket.emit("typing", { username, room: classroom, isTyping });
  };

// Inside useEffect(() => {...})

useEffect(() => {
  const newSocket = io.connect("https://isd-b4ev.onrender.com"); // Change to your server URL
  setSocket(newSocket);
  fetch(`https://isd-b4ev.onrender.com/api/room/${classroom}/messages`) // Change to your server URL
    .then(response => response.json())
    .then(messages => {
      setChat(messages);
    })
    .catch(error => {
      console.error('Error retrieving chat messages:', error);
    })
    .finally(() => {
      setIsLoading(false);
    });

  newSocket.emit("joinRoom", classroom);

  newSocket.on("chat", (payload) => {
    setChat((prevChat) => [...prevChat, payload]);
  });

  // Listen for "typing" event from the server
  newSocket.on("typing", (payload) => {
    const { username } = payload;
    console.log(username);
    setTypingUser(username);
  });

  // Listen for "stop typing" event from the server
  newSocket.on("stop typing", () => {
    setTypingUser(null); // Update the state to remove the typing user from the header
  });

  return () => {
    newSocket.emit("leaveRoom", classroom);
    newSocket.disconnect();
  };
}, []);


  useEffect(() => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  }, [chat]);

  return (
    <>
      <div className="chat-container">
        <div className="header">
          <span className="icon"><SiIcons.SiGoogleclassroom size={30} /></span>
          <div className="classuser" >
            
          <span className="classroom-name">{classroom}'s Classroom</span>
          {typingUser && typingUser!==username&& (
      
          <span className="typing-user" >{typingUser} is typing...</span>
        
      )}
          </div>
        </div>

        <div className="chat-messages" ref={chatMessagesRef}>
          {chat.map((payload, index) => (
            <div
              key={index}
              className={`chat-message ${payload.userid === userid ? "right" : "left"}`}
            >
              <div className="message-content">
                <div className="message-header">
                  <span className="username">{payload.userid === userid ? "You" : payload.username}</span>
                </div>
                <span className="message-text">{payload.message}</span>
              </div>
              <div className={`message-timestamp ${payload.userid === userid ? "right" : "left"}`}>
                {new Date(payload.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendChat} className="chat-form">
          <input
            type="text"
            name="chat"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={() => sendTypingStatus(true)} 
            onBlur={() => sendTypingStatus(false)}
            // onClick={()=>sendTypingStatus(true)}
            className="chat-input"
            autoComplete="off"
          />
          <button type="submit" className="chat-button">
            <IoIcons.IoMdSend size={23} />
          </button>
        </form>
      </div>

      {/* Display typing user */}
      

      {/* Loader backdrop */}
      {loader && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </>
  );
};

export default Chat;
