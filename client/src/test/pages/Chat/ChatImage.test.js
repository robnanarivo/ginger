import React from 'react';
import renderer from 'react-test-renderer';
import ChatImage from '../../../pages/Chat/ChatImage';
import 'jest-styled-components';

describe('ChatImage unit test', () => {
  it('ChatImage Snapshot test', () => {
    const tree = renderer
      .create(<ChatImage sender="You" isSelf timestamp="20211202" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
