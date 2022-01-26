import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MessageArea from '../../../pages/Chat/MessageArea';
import { getMessageHistory } from '../../../api/messageAPI';
import 'jest-styled-components';

jest.mock('../../../api/messageAPI');

describe('MessageArea unit test', () => {
  beforeEach(() => {
    const messages = [{
      _id: 123,
      timestamp: 0,
      sender: 'bob',
      message: {
        content: 'I am good',
        contentType: 'text',
      },
    }];
    getMessageHistory.mockResolvedValue(messages);
  });

  it('Mock new message', async () => {
    await act(async () => {
      render(<MessageArea />);
    });
    expect(screen.queryByText(/good/i)).toBeInTheDocument();
  });

  it('MessageArea Snapshot test', () => {
    const tree = renderer
      .create(<MessageArea />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
