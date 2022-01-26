import React from 'react';
import renderer from 'react-test-renderer';
import FileChip from '../../../pages/CreatePost/FileChip';
import 'jest-styled-components';

describe('FileChip unit test', () => {
  it('FileChip Snapshot test', () => {
    const file = {
      file: {
        name: 'good file',
      },
    };
    const tree = renderer
      .create(<FileChip file={file} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
