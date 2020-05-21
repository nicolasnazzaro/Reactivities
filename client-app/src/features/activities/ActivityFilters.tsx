import React, { Fragment, useContext } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const ActivityFilters = () => {
  
  const rootStore = useContext(RootStoreContext);
  const {predicate, setPredicate} = rootStore.activityStore;

  return(
    <Fragment>
         <Menu vertical size={'large'} style={{ width: '100%'}}>
            <Header icon={'filter'} attached content={'Filters'} />
            <Menu.Item 
              active={predicate.size === 0} 
              color={'teal'} 
              name={'all'} 
              content={'All Activities'}
              onClick={() => setPredicate('all', 'true')} 
            />
            <Menu.Item
              active={predicate.has('isGoing')}
              onClick={() => setPredicate('isGoing', 'true')}
              color={'teal'} 
              name={'username'} 
              content={"I'm Going"} 
            />
            <Menu.Item
              active={predicate.has('isHost')}
              onClick={() => setPredicate('isHost', 'true')} 
              color={'teal'} 
              name={'host'} 
              content={"I'm hosting"} 
            />
        </Menu>
        <Menu vertical size={'large'} style={{ width: '100%'}}>
          <Header icon={'calendar'} attached content={'Select Date'}/>
            <Calendar 
              onChange={(date) => setPredicate('startDate', date!)}
              value={predicate.get('startDate') || new Date()}
            />
        </Menu>
  </Fragment>
  ) 
}

export default observer(ActivityFilters);