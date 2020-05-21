import React, { useContext, useEffect, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceholder from './ActivityListItmePlaceholder';

const ActivityDashboard = () => {

    const rootStore = useContext(RootStoreContext);
    const {loadActivities, loadingInitial, setPage, page, totalPages} = rootStore.activityStore;

    const [loadingNext, setLoadingNext] = useState(false);

    useEffect(() => {
        loadActivities();
    }, [loadActivities])

    const handleGetNext = () => {
        setLoadingNext(true);
        setPage(page + 1);
        loadActivities().then(() => setLoadingNext(false));
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                {loadingInitial && page === 0 ? <ActivityListItemPlaceholder/> : (
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && page + 1 < totalPages}
                        initialLoad={false}
                    >
                        <ActivityList/>
                    </InfiniteScroll>
                ) }
            </Grid.Column>
            <Grid.Column width={6}>
                <div style={{position: 'fixed', width: '30%'}}>
                    <ActivityFilters/>
                </div>
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} style={{margin: 10}}/>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);