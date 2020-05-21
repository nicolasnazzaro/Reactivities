import React from 'react';
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';
import ProfileActivities from './ProfileActivities';

const panes = [
    {menuItem: 'About', render: () => <ProfileDescription/>},
    {menuItem: 'Photos', render: () => <ProfilePhotos/>},
    {menuItem: 'Activities', render: () => <ProfileActivities/>},
    {menuItem: 'Followers', render: () => <ProfileFollowings predicate={'followers'}/>},
    {menuItem: 'Following', render: () => <ProfileFollowings predicate={'following'}/>}
]

const ProfileContent = () => {
    return (
        <Tab
            menu={{fluid: true, vertical: true}}
            menuPosition='right'
            panes={panes}
        />
    )
}

export default ProfileContent;