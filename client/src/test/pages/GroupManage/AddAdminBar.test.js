import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
// import { render, screen } from '@testing-library/react';
import AddAdminBar from '../../../pages/GroupManage/AddAdminBar/AddAdminBar';
import 'jest-styled-components';

describe('AddAdminBar unit test', () => {
  it('AddAdminBar Snapshot test', () => {
    const admins = [
      { id: 123, userName: 'goodboy' },
    ];

    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <Router history={history}>
          <AddAdminBar admins={admins} users={admins} />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
