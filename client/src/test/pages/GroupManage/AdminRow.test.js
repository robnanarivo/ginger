import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
// import { render, screen } from '@testing-library/react';
import AdminRow from '../../../pages/GroupManage/AdminRow/AdminRow';
import 'jest-styled-components';

describe('AdminRow unit test', () => {
  it('AdminRow Snapshot test', () => {
    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <Router history={history}>
          <AdminRow />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
