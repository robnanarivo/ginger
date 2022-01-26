import React from 'react';
import renderer from 'react-test-renderer';
import NotiRow from '../../../shared/components/NavBar/NotiRow';
import 'jest-styled-components';

describe('NotiRow unit test', () => {
  it('NotiRow Snapshot test', () => {
    const noti = {
      notificationId: 123,
      type: 123,
    };
    const tree = renderer
      .create(<NotiRow noti={noti} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
