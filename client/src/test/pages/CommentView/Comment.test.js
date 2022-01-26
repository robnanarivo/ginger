import React from 'react';
import renderer from 'react-test-renderer';
import Comment from '../../../pages/CommentView/Comments/Comment/Comment';
import 'jest-styled-components';

describe('Comment unit test', () => {
  it('Comment Snapshot test', () => {
    const admins = [
      { id: 123, userName: 'goodboy' },
    ];
    const tree = renderer
      .create(<Comment admins={admins} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
