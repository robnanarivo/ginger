import React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';
import TopicList from '../../../pages/GroupView/GroupInfo/TopicList';
import 'jest-styled-components';

describe('TopicList unit test', () => {
  it('TopicList Snapshot test', () => {
    const tree = renderer
      .create(<TopicList
        topics={['Sports', 'Universe', 'Science']}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('TopicList contains correct element', () => {
    render(<TopicList
      topics={['Sports', 'Universe', 'Science']}
    />);
    // contains Sports topic
    expect(screen.getByText('Sports')).toBeInTheDocument();
    // contains Universe topic
    expect(screen.getByText('Universe')).toBeInTheDocument();
  });
});
