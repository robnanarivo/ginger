import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SendArea from '../../../pages/Chat/SendArea';
import 'jest-styled-components';

describe('SendArea unit test', () => {
  it('SendArea Snapshot test', () => {
    const tree = renderer
      .create(<SendArea />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Click upload image', () => {
    const result = render(<SendArea />);
    const upload = result.container.querySelector('#ImageButton');
    userEvent.click(upload);
  });

  it('Click upload audio', () => {
    const result = render(<SendArea />);
    const upload = result.container.querySelector('#AudioButton');
    userEvent.click(upload);
  });

  it('Click upload video', () => {
    const result = render(<SendArea />);
    const upload = result.container.querySelector('#VideoButton');
    userEvent.click(upload);
  });

  it('Send message', () => {
    const result = render(<SendArea />);
    const send = result.container.querySelector('#send');
    userEvent.click(send);
  });
});
