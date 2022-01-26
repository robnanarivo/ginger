import React from 'react';
import renderer from 'react-test-renderer';
import {
  screen,
  render,
} from '@testing-library/react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import TopicBar from '../../../pages/MainView/TopicBar';
import 'jest-styled-components';

describe('TopicBar unit test', () => {
  it('TopicBar Snapshot test', async () => {
    const history = createMemoryHistory();
    const tree = renderer.create(
      <Router history={history}>
        <TopicBar />
      </Router>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Topic contains correct elements test', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <TopicBar />
      </Router>,
    );
    // contains public topic
    expect(screen.getByText('Public')).toBeInTheDocument();
    // contains All Groups Topic
    expect(screen.getByText('Joined')).toBeInTheDocument();
  });

  it('Topic Click test', async () => {
    const history = createMemoryHistory();
    render(
      <Router history={history}>
        <TopicBar topic="Public" updateListOfGroups={() => {}} />
      </Router>,
    );
    // click All Groups topic
    const agButton = screen.getByText('Public');
    userEvent.click(agButton);
    expect(history.location.pathname).toBe('/public');
    // click Public topic
    const pubButton = screen.getByText('Private');
    userEvent.click(pubButton);
    expect(history.location.pathname).toBe('/private');
  });
});
