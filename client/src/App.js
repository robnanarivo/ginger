import { React, useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';
import {
  MainView,
  GroupView,
  Login,
  GroupManage,
  CommentView,
  CreatePost,
  NewGroup,
  Profile,
  Signup,
  Chat,
} from './pages';
import { NavBar } from './shared/components';

const App = () => {
  const [showNav, setShowNav] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatter, setChatter] = useState('');
  const [chatterId, setChatterId] = useState('');
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('userToken')) {
      setShowNav(true);
      return;
    }
    setShowNav(false);
  }, []);

  const createGroupPop = () => {
    setCreateGroupOpen(!createGroupOpen);
  };

  const openChat = (newChatter, newChatterId) => {
    setChatter(newChatter);
    setChatterId(newChatterId);
    setChatOpen(true);
  };

  const closeChat = () => {
    setChatOpen(false);
  };

  return (
    <Router>
      <div>
        {
          showNav
            ? <NavBar createGroupPop={createGroupPop} openNavBar={setShowNav} />
            : ''
        }
        <Switch>
          <Route exact path="/login">
            <Login openNavBar={setShowNav} />
          </Route>
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/groupboard/:groupId/createpost" component={CreatePost} />
          <Route exact path="/groupboard/:groupId/adminPanel" component={withRouter(GroupManage)} />
          <Route exact path="/groupboard/:groupId/:postId" component={CommentView} />
          <Route exact path="/groupboard/:groupId" component={withRouter(GroupView)} />
          <Route exact path="/:topic" component={withRouter(MainView)} />
          <Route exact path="/" component={withRouter(MainView)} />
          <Route exact path="/user/:userId">
            <Profile openChat={openChat} />
          </Route>
        </Switch>
        <NewGroup createGroupPop={createGroupPop} open={createGroupOpen} />
        {
          chatOpen
            ? <Chat chatter={chatter} chatterId={chatterId} onClose={closeChat} />
            : ''
        }
      </div>
    </Router>
  );
};

export default App;
