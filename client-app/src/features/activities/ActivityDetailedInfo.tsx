import { Segment, Grid, Icon } from "semantic-ui-react";
import React from "react";
import { IActivity } from "../../app/models/activity";
import { format } from "date-fns";

const ActivityDetailedInfo: React.FC<{activity: IActivity}> = ({activity}) => {
    return (
      <Segment.Group>
        <Segment attached='top'>
          <Grid>
            <Grid.Column width={1}>
              <Icon size='large' name='info'/>
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{activity.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign='middle'>
            <Grid.Column width={1}>
              <Icon name='calendar' size='large'/>
            </Grid.Column>
            <Grid.Column width={15}>
              <span>{format(activity.date!, 'EEEE do MMMM yyyy')} at {format(activity.date!, 'h:mm a')}</span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign='middle'>
            <Grid.Column width={1}>
              <Icon name='marker' size='large'/>
            </Grid.Column>
            <Grid.Column width={11}>
              <span>
                {activity.venue}, {activity.city}
              </span>
            </Grid.Column>
          </Grid>
        </Segment>
      </Segment.Group>
    );
  };
  
  export default ActivityDetailedInfo;
  