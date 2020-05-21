import { IActivity } from "../../app/models/activity";
import { Segment, Item, Header, Button, Image } from "semantic-ui-react";
import React, { useContext, Fragment } from "react";
import { observer } from "mobx-react-lite";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

const activityImageStyle = {
    filter: 'brightness(30%)'
  };
  
  const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
  };
  
  const ActivityDetailedHeader: React.FC<{activity: IActivity}> = ({activity}) => {
    const host = activity.attendees.filter(x => x.isHost)[0];

    const rootStore = useContext(RootStoreContext);
    const {attendActivity, cancelAttendance, loading, submitting, deleteActivity} = rootStore.activityStore;

    return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment style={activityImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={activity.title}
                  style={{ color: 'white' }}
                />
                <p>{format(activity.date, 'eeee do MMMM')}</p>
                <p>
                  Hosted by 
                  <strong>
                    <Link style={{color: 'white'}} to={`profile/${host.username}`}>{host.displayName}</Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {activity.isHost ? (
          <Fragment>
            <Button
            loading={submitting}
            floated='right'
            inverted
            color='red'
            onClick={() => deleteActivity(activity.id)}
          >
           Cancel Event
          </Button>
            <Button
              as={Link}
              to={`/manage/${activity.id}`}
              floated='right'
            >
            Manage Event
          </Button>
          </Fragment>
        ) : activity.isGoing ? (
          <Button onClick={cancelAttendance} loading={loading}>
            Cancel attendance
          </Button>
        ) : (
          <Button color='teal' onClick={attendActivity} loading={loading}>
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
  };
  
  export default observer(ActivityDetailedHeader);