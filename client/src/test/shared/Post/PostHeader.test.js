import React from 'react';
import renderer from 'react-test-renderer';
import PostHeader from '../../../shared/components/Post/PostHeader';
import 'jest-styled-components';

describe('PostHeader unit test', () => {
  it('PostHeader Snapshot test', () => {
    const tree = renderer
      .create(
        <PostHeader creatorName="Bob" />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
