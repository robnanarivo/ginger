import React from 'react';
import renderer from 'react-test-renderer';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import GroupHeader from '../../../pages/GroupView/GroupHeader';
import { updateGroup } from '../../../api';
import 'jest-styled-components';

jest.mock('../../../api');

describe('Group Header unit test', () => {
  beforeEach(() => {
    updateGroup.mockResolvedValue(true);
  });

  it('Group Header Snapshot test', async () => {
    const history = createMemoryHistory();
    let tree;
    await renderer.act(async () => {
      tree = renderer.create(
        <Router history={history}>
          <GroupHeader
            groupName="Guardians of the Galaxy"
            creatorId="1"
            groupPic=""
            userStatus="joined"
            updateUserStatus={() => {}}
          />
        </Router>,
      );
    });
    expect(tree).toMatchSnapshot();
  });
});
