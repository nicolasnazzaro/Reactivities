import React, { useContext } from 'react'
import { Menu, Container, Button, Image, Dropdown } from 'semantic-ui-react';
import { NavLink, Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const NavBar = () => {
    const rootStore = useContext(RootStoreContext);
    const {logout, user} = rootStore.userStore;

    return (
        <Menu fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to={'/'} exact>Reactivities</Menu.Item>
                <Menu.Item as={NavLink} to={'/activities'}>Activities</Menu.Item>
                <Menu.Item>
                    <Button
                        as={NavLink} to={'/createActivity'} 
                        color='teal'
                        content='Create Activity'/>
                </Menu.Item>
                {user &&
                    <Menu.Item position='right'>
                        <Image avatar spaced src={user.image || '/assets/user.png'}/>
                        <Dropdown pointing='top left' text={user.displayName}>
                            <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={`/profile/${user.username}`}
                                text='My profile'
                                icon='user'
                            />
                                <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                }
            </Container>
        </Menu>
    )
}

export default observer(NavBar);