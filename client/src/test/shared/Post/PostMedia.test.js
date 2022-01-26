import React from 'react';
import renderer from 'react-test-renderer';
import PostMedia from '../../../shared/components/Post/PostMedia';
import 'jest-styled-components';

describe('PostMedia unit test', () => {
  it('PostMedia Snapshot test', () => {
    const tree = renderer
      .create(
        <PostMedia content={{ text: '123' }} />,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
