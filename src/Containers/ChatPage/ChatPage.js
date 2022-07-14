import React, { useEffect, useState } from 'react';
import { fetchCurrentUser, fireAuth, getChats, sendChat, getChatList } from '../../service';
import './ChatPage.css';
import { Grid, TextField } from '@material-ui/core';
import IconNext from '../../Assets/icons/IconNext';

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [chats, setChats] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [selectedChatUser, setSelectedClientChat] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      fireAuth.onAuthStateChanged(async user => {
        if (user) {
          const fetchedCurrentUser = await fetchCurrentUser();
          let fetchedChatList = [];
          console.log(fetchedCurrentUser.userId)
          fetchedChatList = await getChatList(fetchedCurrentUser.userId);
          
          
          setChatList(fetchedChatList);
          setReceiverId(fetchedChatList[selectedChatUser].id);
          setSenderId(fetchedCurrentUser.id);

          setCurrentUser(fetchedCurrentUser);

          if (fetchedChatList.length > 0){
            const fetchedChats = await getChats(
              fetchedChatList[selectedChatUser].senderId,
              fetchedChatList[selectedChatUser].receiverId
              );
            setChats(fetchedChats);
          }
        }
      })
    }
    fetchData();
  }, [refresh]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser === null) return;
      const fetchedChats = await getChats(chatList[selectedChatUser].id, currentUser.id);

      setChats(fetchedChats);
      setReceiverId(chatList[selectedChatUser].id);
      setSenderId(currentUser.id);
    }
    fetchData();
  }, [selectedChatUser]);

  const renderChatList = () => {
    return chatList.map((chatItem, idx) => {
      const { name, message: messageChat } = chatItem;
      return <Grid item xs={12}>
        <div
          style={{
            display: 'flex',
            padding: '0 20px 20px 20px',
            borderBottom: '1px solid #E5E5E5',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedClientChat(idx)}
        >
          <img
            src={require('../../Assets/images/logo-bw.png')}
            className='chat-detail-image-empty'
            alt=''
          />
          <div style={{
            marginLeft: '20px'
          }}>
            <h3>{name}</h3>
            <p>{`${messageChat.slice(0,18)}...`}</p>
          </div>
        </div>
      </Grid>
    })
  }
  console.log("CHATS:", chats)

  const renderChats = () => {
    return chats.map(chat => {
      const { senderId, message } = chat;
      return (
        <div className={senderId === currentUser.userId ? 'chat-bubble-mine' : 'chat-bubble-others'}>
          {message}
        </div>
      )
    })
  }

  const handleSendChat = async () => {
    const chatData = {
      senderId: currentUser.userId,
      receiverId: chatList[selectedChatUser].receiverId !== currentUser.userId ?
        chatList[selectedChatUser].receiverId : chatList[selectedChatUser].senderId,
      senderName: currentUser.name,
      receiverName: chatList[selectedChatUser].receiverId !== currentUser.userId ?
        chatList[selectedChatUser].receiverName : chatList[selectedChatUser].senderName,
      message: message
    };
    await sendChat(chatData);
    setMessage('')
    setRefresh(refresh + 1);
  }

  const renderChatProfile = () => {
    const nameSource = () => {
      if (chatList.length > 0) {
        const { name } = chatList[selectedChatUser];
        return name || ''
      }
    }

    return (
      <div
        style={{
          display: 'flex',
          marginBottom: '40px',
          padding: '0 40px 40px 40px',
          borderBottom: '1px solid #E5E5E5'
        }}
      >
        <img
          src={require('../../Assets/images/logo-bw.png')}
          className='chat-detail-image-empty'
          alt=''
        />
        <div style={{marginLeft: '20px'}}>
          <h2 className='chat-detail-title'>{nameSource()}</h2>
        </div>
      </div>
    )
  } 

  const renderChatWindow = () => {
    return (
      <div className='chat-detail-wrapper'>
        <div style={{marginTop: '20px'}}>
          <Grid container>
            <Grid item xs={3}>
              <div style={{borderRight: '1px solid #E5E5E5', width: '100%', height: '100%', maxHeight: '650px', overflow: 'scroll'}}>
                <Grid container>
                  <div style={{width: '100%'}}>
                  {renderChatList()}
                  </div>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={9}>
              <Grid container>
                <Grid item xs={12}>
                {renderChatProfile()}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <div style={{height: '350px', overflow: 'scroll'}}>
                  {renderChats()}
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  style={{
                    width: '100%',
                    border: '1px solid #E5E5E5'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <div style={{display: 'flex'}}>
                  <div style={{marginLeft: '20px', padding: '40px', width: '85%'}}>
                    <TextField
                      fullWidth
                      id="chat"
                      placeholder="Input your message here"
                      value={message}
                      onChange={(e) => {setMessage(e.target.value)}}
                    />
                  </div>
                  <div
                    className='chat-detail-redirect-button'
                    onClick={() => handleSendChat()}
                  >
                    <IconNext />
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }

  const renderEmptyPage = () => {
    return (
      <div style={{
        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '200px',
        color: '#C5C5C5'
      }}>
        <h1>No incoming message</h1>
      </div>
    )
  }

  return (
    <>
      {
        chatList.length > 0 ?
          renderChatWindow()
          : renderEmptyPage()
      }
    </>
  )

}
export default ChatPage;