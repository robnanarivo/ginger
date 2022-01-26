import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { NavBar } from '../../../shared/components';
import 'jest-styled-components';

describe('NavBar unit test', () => {
  it('NavBar Snapshot test', () => {
    const tree = renderer
      .create(<NavBar />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('NavBar contains correct element', () => {
    render(<NavBar />);
    // contains logo text
    expect(screen.getByText('Ginger')).toBeInTheDocument();
    // contains logo image
    expect(screen.getByRole('img')).toBeInTheDocument();
    // contains search bar
    expect(screen.getByLabelText('search')).toBeInTheDocument();
    // contains user account button
    expect(screen.getByLabelText('account of current user')).toBeInTheDocument();
  });
});
