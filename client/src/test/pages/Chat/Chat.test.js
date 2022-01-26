import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { Chat } from '../../../pages';
import 'jest-styled-components';

describe('Chat unit test', () => {
  it('Chat Snapshot test', () => {
    const tree = renderer
      .create(<Chat chatter="Tom" chatterId={1} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Chat contains correct element', () => {
    render(<Chat chatter="Tom" chatterId={1} />);
    // contains group topic
    expect(screen.getByText('Tom')).toBeInTheDocument();
  });
});
