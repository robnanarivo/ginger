import React from 'react';
import renderer from 'react-test-renderer';
import ChatVideo from '../../../pages/Chat/ChatVideo';
import 'jest-styled-components';

describe('ChatVideo unit test', () => {
  it('ChatVideo Snapshot test', () => {
    const tree = renderer
      .create(<ChatVideo sender="You" isSelf timestamp="20211202" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
