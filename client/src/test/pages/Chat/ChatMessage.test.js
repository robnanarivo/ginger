import React from 'react';
import renderer from 'react-test-renderer';
import ChatMessage from '../../../pages/Chat/ChatMessage';
import 'jest-styled-components';

describe('ChatMessage unit test', () => {
  it('ChatMessage Snapshot test', () => {
    const tree = renderer
      .create(<ChatMessage sender="You" isSelf timestamp="20211202" content="Wow" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
