import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import PostActions from '../../../shared/components/Post/PostActions';
import 'jest-styled-components';

describe('PostActions unit test', () => {
  it('PostActions Snapshot test', () => {
    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <Router history={history}>
          <PostActions creatorName="Bob" admins={[]} />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
