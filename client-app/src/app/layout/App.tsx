import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, withRouter, Switch } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import NavBar from '../../features/navbar/NavBar';
import ActivityDashboard from '../../features/activities/ActivityDashboard';
import ActivityForm from '../../features/activities/ActivityForm';
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';
import ModalContainer from '../common/modals/ModalContainer';
import NotFound from './NotFound';
import ActivityDetails from '../../features/activities/ActivityDetails';
import LoadingComponent from './LoadingComponent';
import {ToastContainer} from 'react-toastify';
import ProfilePage from '../../features/profile/ProfilePage';
import PrivateRoute from './PrivateRoute';

function App() {

  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded} = rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded)  return <LoadingComponent content='Loading app...' />

  return (
    <Fragment>
      <ToastContainer position='bottom-right'/>
      <ModalContainer/>
      <Route exact path='/' component={HomePage}/>
      <Route 
        path='/(.+)'
        render={() => (
          <Fragment>
            <NavBar/>
            <Container style={{marginTop: '7em'}}>
              <Switch>
                <PrivateRoute exact path='/activities' component={ActivityDashboard}/>
                <PrivateRoute path='/activities/:id' component={ActivityDetails}/>
                <PrivateRoute path='/createActivity' component={ActivityForm}/>
                <PrivateRoute path='/manage/:id' component={ActivityForm}/>
                <PrivateRoute path='/login' component={LoginForm}/>
                <PrivateRoute path='/profile/:username' component={ProfilePage}/>
                <Route component={NotFound}/>
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
}

export default withRouter(observer(App));