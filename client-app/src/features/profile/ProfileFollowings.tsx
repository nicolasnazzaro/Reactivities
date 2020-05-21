import React, { useContext, useEffect } from 'react';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import { observer } from 'mobx-react-lite';

interface IProps {
    predicate: string
}

const ProfileFollowings: React.FC<IProps> = ({predicate}) => {
  
    const rootStore = useContext(RootStoreContext);
    const {profile, followings, loadFollowings, loading } = rootStore.profileStore;

    useEffect(() => {
        loadFollowings(predicate)
    }, [loadFollowings, predicate]);
  
    return (
        <Tab.Pane loading={loading}>
        <Grid>
            <Grid.Column width={16}>
            <Header
                floated='left'
                icon='user'
                content={
                predicate === 'followers'
                    ? `People following ${profile!.displayName}`
                    : `People ${profile!.displayName} is following`
                }
            />
            </Grid.Column>
            <Grid.Column width={16}>
            <Card.Group itemsPerRow={5}>
                {followings.map((profile) => (
                    <ProfileCard key={profile!.username} profile={profile} />
                ))}
            </Card.Group>
            </Grid.Column>
        </Grid>
        </Tab.Pane>
  );
};

export default observer(ProfileFollowings);