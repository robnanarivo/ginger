import React from 'react';
import renderer from 'react-test-renderer';
import {
  cleanup,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { GroupView } from '../../../pages';
import { groupData } from '../../../api/mockFetch';
import { getGroupData } from '../../../api';
import { getGroupPosts } from '../../../api/postAPI';
import 'jest-styled-components';

jest.mock('../../../api');
jest.mock('../../../api/postAPI');

describe('GroupView test', () => {
  beforeEach(() => {
    getGroupData.mockResolvedValue(groupData);
    getGroupPosts.mockResolvedValue([]);
  });

  afterEach(cleanup);

  it('GroupView Snapshot test', async () => {
    const history = createMemoryHistory();
    let tree;
    await renderer.act(async () => {
      tree = renderer
        .create(
          <Router history={history}>

            <GroupView />
          </Router>,
        )
        .toJSON();
    });
    expect(tree).toMatchSnapshot();
  });

  // it('GroupView contains correct element', async () => {
  //   await act(async () => { await act(async () => { render(<GroupView />); }); });
  //   // contains group detailed info
  //   expect(screen.getByText('About')).toBeInTheDocument();
  //   // contains group post
  //   expect(screen.getAllByText('24 Comments')[0]).toBeInTheDocument();
  // });

  // it('GroupView leave button is clickable', async () => {
  //   // mock update group
  //   updateGroup.mockResolvedValue(false);
  //   // render page
  //   await act(async () => { await act(async () => { render(<GroupView />); }); });
  //   // get leave button
  //   const leaveButuon = screen.getAllByText('LEAVE')[0];
  //   // click leave button
  //   await act(async () => { userEvent.click(leaveButuon); });
  //   // check leave button status
  //   expect(leaveButuon.innerHTML).toContain('JOIN');
  // });
});
