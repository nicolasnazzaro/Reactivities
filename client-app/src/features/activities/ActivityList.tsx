import React, { useContext, Fragment } from 'react';
import { Item } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ActivityListItem from './ActivityListItem';

const ActivityList = () => {

    const rootStore = useContext(RootStoreContext);
    const {activitiesByDate} = rootStore.activityStore;
    
    return (
        <Fragment>
            {activitiesByDate.map((activity) => (
                <Item.Group divided key={activity.id}>
                    <ActivityListItem activity={activity}/>
                </Item.Group>
            ))}
        </Fragment>
    )
}

export default ActivityList;