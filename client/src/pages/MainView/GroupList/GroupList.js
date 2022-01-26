import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import GroupRow from './GroupRow';

function displayGroups(listOfGroups) {
  const res = [];
  let count = 0;
  listOfGroups.forEach((group) => {
    count += 1;
    res.push(
      <GroupRow
        key={group.groupId}
        number={count}
        groupId={group.groupId}
        groupPic={group.groupIcon}
        groupName={group.groupName}
        member={group.member}
        userStatus={group.userStatus}
      />,
    );
    if (count !== listOfGroups.length) {
      res.push(<Divider key={`d${count}`} />);
    }
  });
  return res;
}

export default function GroupList(props) {
  const { listOfGroups } = props;
  return (
    <List
      sx={{
        width: '100%',
        marginTop: 8,
        maxWidth: 720,
        bgcolor: '#FFFFFF',
        alignSelf: 'flex-start',
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        (
          <ListSubheader component="div" id="nested-list-subheader" sx={{ bgcolor: '#E5E5E5' }}>
            All Groups
          </ListSubheader>
        )
      }
    >
      {displayGroups(listOfGroups)}
    </List>
  );
}
