import React from 'react';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search'/>
                Oops we couldn't find the requested page.
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' color='teal'>
                    Return to the Activities
                </Button>
            </Segment.Inline>
        </Segment>
    )
}

export default NotFound;