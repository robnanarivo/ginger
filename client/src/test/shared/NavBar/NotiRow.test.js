import React from 'react';
import renderer from 'react-test-renderer';
import NotiList from '../../../shared/components/NavBar/NotiList';
import 'jest-styled-components';

describe('NotiList unit test', () => {
  it('NotiList Snapshot test', () => {
    const notiList = [{
      notificationId: 123,
      type: 123,
    }];
    const tree = renderer
      .create(<NotiList notiList={notiList} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
