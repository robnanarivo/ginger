import React from 'react';
import renderer from 'react-test-renderer';
import ChatAudio from '../../../pages/Chat/ChatAudio';
import 'jest-styled-components';

describe('ChatAudio unit test', () => {
  it('ChatAudio Snapshot test', () => {
    const tree = renderer
      .create(<ChatAudio sender="You" isSelf timestamp="20211202" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
