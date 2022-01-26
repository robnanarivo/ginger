import React from 'react';
import renderer from 'react-test-renderer';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
// import { render, screen } from '@testing-library/react';
import { Profile } from '../../../pages';
import 'jest-styled-components';

describe('Profile unit test', () => {
  it('Profile Snapshot test', () => {
    const history = createMemoryHistory();
    const tree = renderer
      .create(
        <Router history={history}>
          <Profile isSelf />
        </Router>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // it('Profile contains update button', () => {
  //   render(<Profile isSelf />);
  //   // contains cancel button
  //   expect(screen.getByText(/update/i)).toBeInTheDocument();
  // });
});
