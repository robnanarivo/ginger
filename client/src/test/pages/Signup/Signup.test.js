import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import Signup from '../../../pages/Signup/Signup';
import 'jest-styled-components';

describe('Signup unit test', () => {
  it('Signup Snapshot test', () => {
    const tree = renderer
      .create(<Signup />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Signup contains correct element', () => {
    render(<Signup />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Sign in')).toBeInTheDocument();
  });
});
