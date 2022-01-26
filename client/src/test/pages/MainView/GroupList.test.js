import React from 'react';
import renderer from 'react-test-renderer';
import {
  screen,
  render,
} from '@testing-library/react';
import { listOfGroupAll } from '../../../api/mockFetch';
import GroupList from '../../../pages/MainView/GroupList';
import 'jest-styled-components';

describe('GroupList unit test', () => {
  it('GroupList Snapshot test', async () => {
    const tree = renderer.create(
      <GroupList listOfGroups={listOfGroupAll} />,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('GroupList contains correct elements test', async () => {
    render(
      <GroupList listOfGroups={listOfGroupAll} />,
    );
    // contains group with index 1
    expect(screen.getByText('1')).toBeInTheDocument();
    // contains group with index 10
    expect(screen.getByText('10')).toBeInTheDocument();
    // contains galaxy group
    expect(screen.getByText('Galaxy')).toBeInTheDocument();
    // contains LEAVE Button
    expect(screen.getAllByText('LEAVE')[0]).toBeInTheDocument();
    // contains PENDING Button
    expect(screen.getAllByText('PENDING')[0]).toBeInTheDocument();
    // contains JOIN Button
    expect(screen.getAllByText('JOIN')[0]).toBeInTheDocument();
  });
});
