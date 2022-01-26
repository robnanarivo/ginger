import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import Stats from '../../../pages/GroupView/GroupInfo/Stats';
import 'jest-styled-components';

describe('Stats unit test', () => {
  it('Stats Snapshot test', () => {
    const tree = renderer
      .create(<Stats
        groupInfo={{ createOn: 'Feb 20 2008', member: '2.8k' }}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Stats contains correct element', () => {
    render(<Stats
      groupInfo={{ createOn: 'Feb 20 2008', member: '2.8k' }}
    />);
    // contains Created On heading
    expect(screen.getByText('Created on')).toBeInTheDocument();
    // contains Created On Content
    expect(screen.getByText('Feb 20 2008')).toBeInTheDocument();
    // contains Members heading
    expect(screen.getByText('Members')).toBeInTheDocument();
    // contains Members Content
    expect(screen.getByText('2.8k')).toBeInTheDocument();
  });
});
