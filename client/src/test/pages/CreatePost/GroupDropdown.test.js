import React from 'react';
import renderer from 'react-test-renderer';
import GroupDropdown from '../../../pages/CreatePost/GroupDropdown';
import 'jest-styled-components';

describe('GroupDropdown test', () => {
  it('GroupDropdown Snapshot test', () => {
    const groupList = [
      { id: 123, name: 'cool stuff' },
    ];
    const tree = renderer
      .create(<GroupDropdown groupList={groupList} defaultGroup={123} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
