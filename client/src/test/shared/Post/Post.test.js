import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Post from '../../../shared/components/Post/Post';
import 'jest-styled-components';

describe('Post unit test', () => {
  it('Post Snapshot test', () => {
    const history = createMemoryHistory();
    const content = {
      text: 'fund',
    };
    const tree = renderer
      .create(
        <Router history={history}>
          <Post content={content} creatorName="Bob" admins={[]} />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
