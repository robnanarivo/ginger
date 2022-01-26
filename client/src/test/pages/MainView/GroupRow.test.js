import React from 'react';
import renderer from 'react-test-renderer';
import {
  screen,
  render,
  act,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import GroupRow from '../../../pages/MainView/GroupList/GroupRow';
import { listOfGroupAll } from '../../../api/mockFetch';
import { updateGroup } from '../../../api';
import 'jest-styled-components';

jest.mock('../../../api');

describe('GroupRow unit test', () => {
  beforeEach(() => {
    updateGroup.mockResolvedValue(true);
  });

  it('GroupRow Snapshot test', async () => {
    const history = createMemoryHistory();
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(
        <Router history={history}>
          <GroupRow
            number={1}
            groupId={listOfGroupAll[0].groupId}
            groupPic={listOfGroupAll[0].pic}
            groupName={listOfGroupAll[0].groupName}
            member={listOfGroupAll[0].member}
            userStatus={listOfGroupAll[0].userStatus}
          />
        </Router>,
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('GroupRow contains correct element', async () => {
    await act(async () => {
      const history = createMemoryHistory();
      render(
        <Router history={history}>
          <GroupRow
            number={1}
            groupId={listOfGroupAll[0].groupId}
            groupPic={listOfGroupAll[0].pic}
            groupName={listOfGroupAll[0].groupName}
            member={listOfGroupAll[0].member}
            userStatus={listOfGroupAll[0].userStatus}
          />
        </Router>,
      );
    });
    // contains Galaxy Group
    expect(screen.getByText('Galaxy')).toBeInTheDocument();
    // contains leave button
    expect(screen.getByText('LEAVE')).toBeInTheDocument();
  });

  it('Join button is clickable', async () => {
    await act(async () => {
      const history = createMemoryHistory();
      render(
        <Router history={history}>
          <GroupRow
            number={1}
            groupId={listOfGroupAll[0].groupId}
            groupPic={listOfGroupAll[0].pic}
            groupName={listOfGroupAll[0].groupName}
            member={listOfGroupAll[0].member}
            userStatus={listOfGroupAll[0].userStatus}
          />
        </Router>,
      );
    });
    // get button
    const button = screen.getByText('LEAVE');
    // click button
    await act(async () => {
      userEvent.click(button);
    });
    // check button status
    expect(button.innerHTML).toContain('JOIN');
    // click button again
    await act(async () => {
      userEvent.click(button);
    });
    // check button status
    expect(button.innerHTML).toContain('PENDING');
    // click button again
    await act(async () => {
      userEvent.click(button);
    });
    // check button status
    expect(button.innerHTML).toContain('JOIN');
  });

  it('path rendering', async () => {
    let history;
    await act(async () => {
      history = createMemoryHistory();
      render(
        <Router history={history}>
          <GroupRow
            number={1}
            groupId={listOfGroupAll[0].groupId}
            groupPic={listOfGroupAll[0].pic}
            groupName={listOfGroupAll[0].groupName}
            member={listOfGroupAll[0].member}
            userStatus={listOfGroupAll[0].userStatus}
          />
        </Router>,
      );
    });
    // get box
    const box = screen.getByTestId('b1');
    userEvent.click(box);
    expect(history.location.pathname).toBe(`/groupboard/${listOfGroupAll[0].groupId}`);
  });
});
