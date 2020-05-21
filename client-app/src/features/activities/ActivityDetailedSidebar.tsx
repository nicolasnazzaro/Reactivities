import React, { Fragment } from 'react';
import { Segment, List, Item, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IAttendee } from '../../app/models/activity';
import { observer } from 'mobx-react-lite';

interface IProps {
  attendees: IAttendee[]
} 

const ActivityDetailedSidebar: React.FC<IProps> = ({attendees}) => {
  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
        as='h3'
      >
        {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(attendee => (
            <Item key={attendee.username} style={{ position: 'relative' }}>
              {attendee.isHost && (
                <Label
                  style={{ position: 'absolute' }}
                  color='orange'
                  ribbon='right'
                >
                  Host
                </Label>
              )}
              <Image size='mini' src={attendee.image || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h4'>
                  <Link to={`/profile/${attendee.username}`} style={{color: 'black'}}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
                {attendee.following &&
                  <Item.Extra>Following</Item.Extra>
                }
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedSidebar);