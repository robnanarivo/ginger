import React from 'react';
import renderer from 'react-test-renderer';
import Comments from '../../../pages/CommentView/Comments/Comments';
import 'jest-styled-components';

describe('Comments unit test', () => {
  it('Comments Snapshot test', () => {
    const admins = [
      { id: 123, userName: 'goodboy' },
    ];

    const comments = [
      {
        id: 333, body: 'wow the sky so beautiful!!!', avatar: 'L', date: 'September 16, 2021', name: 'Leo',
      },
    ];

    const tree = renderer
      .create(<Comments admins={admins} comments={comments} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
