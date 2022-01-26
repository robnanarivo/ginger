const postData = {
  topics: ['Sports', 'Universe', 'Science', 'Astronomy'],
  groupInfo: { createOn: 'Feb 20 2008', member: '2.8k' },
  groupId: '11',
  posts: [
    {
      postId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      groupId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
      creatorId: '61b26b150c01529bed74c6f0',
      creatorName: 'Wang',
      title: 'Stars are so beautiful',
      content: {
        text: 'star!',
        image: '/starPic.jpeg',
        audio: '',
        video: '',
      },
      profilePicture: '/starPic.jpeg',
      timestamp: 1639429592291,
      comments: [
        {
          commentId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
          content: 'somewhat random text',
          timeStamp: 1639429592456,
          parentPostId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        },
      ],
      flagedBy: [
        'd290f1ee-6c54-4b01-90e6-d701748f0851',
      ],
      hiddenBy: [
        'd290f1ee-6c54-4b01-90e6-d701748f0851',
      ],
    },
  ],
  groupName: 'Galaxy',
  userStatus: 'joined',
};

export default postData;
