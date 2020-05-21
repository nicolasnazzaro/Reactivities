import React from 'react'
import { IActivity } from '../../app/models/activity';
import { Segment, Icon, Item, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import ActivityListItemAttendees from './ActivityListItemAttendees';

const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) => {
    const host = activity.attendees.filter(x => x.isHost)[0];

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular style={{margin: 10}} src={host.image || '/assets/user.png'}/>
                        <Item.Content>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header><br/>
                        <Label size='mini'>{activity.category}</Label>
                        <Item.Description>Hosted by <Link to={`/profile/${host.username}`}>{host.displayName}</Link></Item.Description>
                        {activity.isHost && (
                            <Item.Description>
                            <Label
                                basic
                                color='blue'
                                size='mini'
                                content='You are hosting this activity'
                            />
                            </Item.Description>
                        )}
                        {activity.isGoing && !activity.isHost && (
                            <Item.Description>
                            <Label
                                basic
                                color='teal'
                                size='mini'
                                content='You are going to this activity'
                            />
                            </Item.Description>
                        )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <p><Icon name='clock' />{format(activity.date!, 'do MMM yyyy')}</p>
                <p><Icon name='marker' />{activity.venue}, {activity.city}</p>
                <p><Icon name='user' />{activity.attendees.length === 1 ? `${activity.attendees.length} Attendee` :
                `${activity.attendees.length} Attendees` }</p>
            </Segment>
            <Segment secondary> <ActivityListItemAttendees attendees={activity.attendees}/> </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    as={Link}
                    to={`/activities/${activity.id}`}
                    floated='right'
                    content='View'
                    color='teal'
                />
            </Segment>
        </Segment.Group>
    )
}

export default ActivityListItem;