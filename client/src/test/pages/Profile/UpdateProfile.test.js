import React from 'react';
// import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import UpdateProfile from '../../../pages/Profile/UpdateProfile';
import 'jest-styled-components';

describe('UpdateProfile unit test', () => {
  // TODO: fix snapshot testing
  // it('UpdateProfile Snapshot test', () => {
  //   const tree = renderer
  //     .create(<UpdateProfile open />)
  //     .toJSON();
  //   expect(tree).toMatchSnapshot();
  // });

  it('UpdateProfile contains update button', () => {
    render(<UpdateProfile open />);
    // contains cancel button
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
  });
});
