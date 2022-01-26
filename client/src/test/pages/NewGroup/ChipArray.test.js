import React from 'react';
import renderer from 'react-test-renderer';
import ChipArray from '../../../pages/NewGroup/ChipArray';
import 'jest-styled-components';

describe('FileChip unit test', () => {
  it('FileChip Snapshot test', () => {
    const labels = ['123', '456'];
    const tree = renderer
      .create(<ChipArray labels={labels} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
