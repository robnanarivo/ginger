import React from 'react';
import renderer from 'react-test-renderer';
import {
  screen,
  render,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import GroupInfo from '../../../pages/GroupView/GroupInfo';
import { updateGroup } from '../../../api';
import 'jest-styled-components';

jest.mock('../../../api');

describe('GroupInfo unit test', () => {
  beforeEach(() => {
    updateGroup.mockResolvedValue(true);
  });

  it('GroupInfo Snapshot test', async () => {
    const history = createMemoryHistory();
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(
        <Router history={history}>
          <GroupInfo
            topics={['Sports', 'Universe', 'Science']}
            groupInfo={{ createOn: 'Feb 20 2008', member: '2.8k' }}
            updateUserStatus={() => {}}
            userStatus="joined"
            inviteUserPop={() => {}}
            isAdmin={false}
          />
        </Router>,
      );
    });
    expect(tree).toMatchSnapshot();
  });

  it('GroupInfo contains correct element joined', async () => {
    const history = createMemoryHistory();
    await act(async () => {
      render(
        <Router history={history}>
          <GroupInfo
            topics={['Sports', 'Universe', 'Science']}
            groupInfo={{ createOn: 'Feb 20 2008', member: '2.8k' }}
            updateUserStatus={() => {}}
            userStatus="joined"
            inviteUserPop={() => {}}
            isAdmin={false}
          />
        </Router>,
      );
    });
    // contains group info heading
    expect(screen.getByText('About')).toBeInTheDocument();
    // contains leave button
    expect(screen.getByText('INVITE')).toBeInTheDocument();
  });

  it('GroupInfo contains correct element not joined', async () => {
    const history = createMemoryHistory();
    await act(async () => {
      render(
        <Router history={history}>
          <GroupInfo
            topics={['Sports', 'Universe', 'Science']}
            groupInfo={{ createOn: 'Feb 20 2008', member: '2.8k' }}
            updateUserStatus={() => {}}
            userStatus="not joined"
            inviteUserPop={() => {}}
            isAdmin={false}
          />
        </Router>,
      );
    });
    // contains group info heading
    expect(screen.getByText('About')).toBeInTheDocument();
    // contains join button
    expect(screen.getByText('JOIN')).toBeInTheDocument();
    const button = screen.getByText('JOIN');
    // click button
    await act(async () => {
      userEvent.click(button);
    });
  });

  it('GroupInfo contains correct element pending', async () => {
    const history = createMemoryHistory();
    await act(async () => {
      render(
        <Router history={history}>
          <GroupInfo
            topics={['Sports', 'Universe', 'Science']}
            groupInfo={{ createOn: 'Feb 20 2008', member: '2.8k' }}
            updateUserStatus={() => {}}
            userStatus="pending"
            inviteUserPop={() => {}}
            isAdmin={false}
          />
        </Router>,
      );
    });
    // contains group info heading
    expect(screen.getByText('About')).toBeInTheDocument();
    // contains join button
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    const button = screen.getByText('PENDING');
    // click button
    await act(async () => {
      userEvent.click(button);
    });
  });
});
