import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { CreatePostBar } from '../../shared/components';
import 'jest-styled-components';

describe('CreatePostBar unit test', () => {
  it('CreatePostBar Snapshot test', () => {
    const tree = renderer
      .create(<CreatePostBar />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('CreatePostBar contains correct element', () => {
    render(<CreatePostBar />);
    // contains group topic
    expect(screen.getByText('Create Post')).toBeInTheDocument();
  });
});
