import React from 'react';
import renderer from 'react-test-renderer';
import {
  screen,
  render,
  act,
  cleanup,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { MainView } from '../../../pages';
import { listOfGroupAll } from '../../../api/mockFetch';
import { getListOfGroups } from '../../../api';
import 'jest-styled-components';

jest.mock('../../../api');

describe('Main View unit test', () => {
  beforeEach(() => {
    getListOfGroups.mockResolvedValueOnce(listOfGroupAll).mockResolvedValueOnce(false);
  });

  afterEach(cleanup);

  it('Main View Snapshot test', async () => {
    const history = createMemoryHistory();
    history.push('/public');
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(
        <Router history={history}>
          <MainView />
        </Router>,
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Main View contains correct element', async () => {
    await act(async () => {
      const history = createMemoryHistory();
      history.push('/public');
      render(
        <Router history={history}>
          <MainView />
        </Router>,
      );
    });
    // contains public topic
    expect(screen.getByText('Public')).toBeInTheDocument();
    // contains Galaxy Group
    expect(screen.getByText('Galaxy')).toBeInTheDocument();
    // contains join button
    expect(screen.getAllByText('JOIN')[0]).toBeInTheDocument();
    // contains leave button
    expect(screen.getAllByText('LEAVE')[0]).toBeInTheDocument();
    // contains pending button
    expect(screen.getAllByText('PENDING')[0]).toBeInTheDocument();
  });

  it('Main View public topic is clickable', async () => {
    const history = createMemoryHistory();
    await act(async () => {
      history.push('/public');
      render(
        <Router history={history}>
          <MainView />
        </Router>,
      );
    });
    // contains public topic
    const publicButton = screen.getByText('Public');
    await act(async () => {
      userEvent.click(publicButton);
    });
    expect(history.location.pathname).toBe('/login');
  });
});
