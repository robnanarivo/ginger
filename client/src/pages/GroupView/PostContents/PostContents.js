import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Post, CreatePostBar } from '../../../shared/components';
import { deletePost, getGroupPosts } from '../../../api/postAPI';

function displayPosts(listOfPosts, updateLP) {
  const history = useHistory();
  const res = [];
  if (!listOfPosts) {
    return res;
  }
  listOfPosts.forEach((post) => {
    res.push(
      <Post
        key={post.id}
        creatorName={post.creatorName}
        creatorId={post.creatorId}
        title={post.title}
        profilePicture={post.profilePicture}
        content={post.content}
        timestamp={post.timestamp}
        admins={post.admins}
        onPostClick={() => { history.push(`${history.location.pathname}/${post.id}`); }}
        handleDelete={async () => {
          await deletePost(post.id);
          updateLP();
        }}
        postId={post.id}
      />,
    );
  });
  return res;
}

export default function PostContents(props) {
  const { userStatus } = props;
  const { groupId } = useParams();
  const [listOfPosts, setListOfPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [showMore, setShowMore] = useState(true);
  const [finishSetUp, setFinishSetUp] = useState(false);
  const [prevTimestamp, setPrevTimestamp] = useState();

  useEffect(() => {
    let interval = null;
    if (finishSetUp) {
      interval = setInterval(async () => {
        const response = await getGroupPosts(groupId, 0);
        if (prevTimestamp !== undefined && response[0].timestamp > prevTimestamp) {
          setPrevTimestamp(response[0].timestamp);
        }
      }, 5000); // update every 60 seconds
    }
    return () => clearInterval(interval);
  }, [finishSetUp]);

  useEffect(async () => {
    if (finishSetUp) {
      const response = await getGroupPosts(groupId, 0);
      setListOfPosts((prev) => [response[0]].concat(prev));
      setOffset((prev) => prev + 1);
    }
  }, [prevTimestamp]);

  useEffect(async () => {
    const result = await getGroupPosts(groupId, offset);
    if (result.length === 0) {
      setPrevTimestamp(0);
      return;
    }
    setListOfPosts(result);
    setOffset((prev) => prev + 10);
    setPrevTimestamp(result[0].timestamp);
    setFinishSetUp(true);
  }, []);

  const updateLP = async () => {
    const result = await getGroupPosts(groupId, 0);
    setListOfPosts(result);
    setOffset(10);
  };
  const load = async () => {
    const oldPosts = await getGroupPosts(groupId, offset);
    if (oldPosts.length === 0) {
      setShowMore(false);
    }
    setListOfPosts((prev) => prev.concat(oldPosts));
    setOffset((prev) => prev + oldPosts.length);
  };
  return (
    <Stack spacing={2} sx={{ width: '600px', mb: 2 }}>
      {
        userStatus === 'joined'
          ? (<CreatePostBar />)
          : ''
      }
      {displayPosts(listOfPosts, updateLP)}
      {showMore
        ? (
          <Button variant="outlined" onClick={load}>
            Load More
          </Button>
        )
        : ''}

    </Stack>
  );
}
