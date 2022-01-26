import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import Login from '../../../pages/Login/Login';
import 'jest-styled-components';

describe('Login unit test', () => {
  it('Login Snapshot test', () => {
    const tree = renderer
      .create(<Login />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Login contains correct element', () => {
    render(<Login />);
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});
