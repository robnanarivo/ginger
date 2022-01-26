import { React, useState, useEffect } from 'react';
import { Typography, Grid } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChatMessage from './ChatMessage';
import ChatImage from './ChatImage';
import ChatAudio from './ChatAudio';
import ChatVideo from './ChatVideo';
import { getMessageHistory, getNewMessage } from '../../api/messageAPI';
import domain from '../../constants/profile';

const serverURL = `${domain}/api/multimedia/`;

const MessageArea = ({ chatter, chatterId }) => {
  const myUserId = sessionStorage.getItem('userId');

  const [messages, setMessages] = useState([]);
  const [prevTimestamp, setPrevTimestamp] = useState();
  const [offset, setOffset] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [finishSetUp, setFinishSetUp] = useState(false);

  const fetchData = async () => {
    const messageHistory = await getMessageHistory(myUserId, chatterId, offset);
    if (messageHistory.length === 0) {
      setHasMore(false);
    }
    setOffset(offset + 10);
    setMessages(messages.concat(messageHistory));
  };

  // initial set-up
  useEffect(async () => {
    const messageHistory = await getMessageHistory(myUserId, chatterId, 0);
    if (messageHistory.length === 0) {
      setHasMore(false);
      setPrevTimestamp(0);
    } else {
      setMessages(messageHistory);
      setPrevTimestamp(messageHistory[0].timestamp);
    }
    setFinishSetUp(true);
  }, []);

  const updateMessage = async () => {
    const newMessage = await getNewMessage(myUserId, chatterId);
    if (prevTimestamp !== undefined
      && newMessage.length > 0
      && newMessage[0].timestamp > prevTimestamp) {
      setPrevTimestamp(newMessage[0].timestamp);
    }
  };

  useEffect(() => {
    let newPolling;
    if (finishSetUp) {
      newPolling = setInterval(updateMessage, 3000);
    }
    return () => clearInterval(newPolling);
  }, [finishSetUp]);

  useEffect(async () => {
    if (finishSetUp) {
      const newMessage = await getNewMessage(myUserId, chatterId);
      setMessages((messageHistory) => newMessage.concat(messageHistory));
      setOffset(offset + 1);
    }
  }, [prevTimestamp]);

  const Loader = () => (
    <Grid container alignItems="center" justifyContent="center">
      <Typography variant="h5" sx={{ color: 'gray' }}>Loading...</Typography>
    </Grid>
  );

  const messageRenderer = (message) => {
    const time = new Date(message.timestamp);
    const timeString = time.toLocaleString();
    let toRender;
    if (message.message.contentType === 'text') {
      toRender = (
        <ChatMessage
          key={message._id}
          sender={message.sender}
          content={message.message.content}
          timestamp={timeString}
          isSelf={message.sender === myUserId}
        />
      );
    } else if (message.message.contentType === 'image') {
      toRender = <ChatImage key={message._id} chatter={chatter} url={`${serverURL}${message.message.content}`} timestamp={timeString} isSelf={message.sender === myUserId} />;
    } else if (message.message.contentType === 'audio') {
      toRender = <ChatAudio key={message._id} chatter={chatter} url={`${serverURL}${message.message.content}`} timestamp={timeString} isSelf={message.sender === myUserId} />;
    } else if (message.message.contentType === 'video') {
      toRender = <ChatVideo key={message._id} chatter={chatter} url={`${serverURL}${message.message.content}`} timestamp={timeString} isSelf={message.sender === myUserId} />;
    }
    return (toRender);
  };

  return (
    <div>
      <div
        id="scrollableDiv"
        style={{
          height: 370, overflow: 'auto', display: 'flex', flexDirection: 'column-reverse',
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          next={fetchData}
          inverse
          hasMore={hasMore}
          loader={<Loader />}
          scrollableTarget="scrollableDiv"
        >
          {messages.map(messageRenderer)}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default MessageArea;
