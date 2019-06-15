/* eslint react/prop-types: 0 */

import React, { Component } from 'react';
import { Query, withApollo } from 'react-apollo';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import { clearLocalUser, getLocalUser } from 'utils/auth';
import currentUserQuery from 'graphql/currentUserQuery';

import Avatar from 'components/shared/Avatar';

const AvatarWithPointer = styled(Avatar)(({ theme: { mq } }) => ({
  cursor: 'pointer',
  marginLeft: '10px',

  [mq('mobileOnly')]: {
    width: '30px',
    height: '30px',
  },
}));

const StyledDropdownToggle = styled(DropdownToggle)({
  padding: 0,
});

const StyledDropdownMenu = styled(DropdownMenu)({
  minWidth: 'unset',
  textAlign: 'right',
  top: '5px !important',
  left: '-100px',
});

const StyledDropdownItem = styled(DropdownItem)(({ theme: { colors } }) => ({
  color: colors.mainText,

  a: {
    color: `${colors.mainText} !important`,
  },

  ':hover, :active': {
    background: colors.hoverBlue,
    color: colors.mainText,
    outline: 'none',
  },
}));

class AvatarDropdown extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      dropdownOpen: false,
    };
  }

  handleToggle() {
    this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }));
  }

  async handleLogout() {
    const { client } = this.props;
    await clearLocalUser();
    await client.resetStore();
    navigate('/');
  }

  render() {
    const { dropdownOpen } = this.state;
    const { userId } = getLocalUser();
    if (!userId) return null;

    return (
      <Query query={currentUserQuery} variables={{ id: userId }}>
        {({ data, loading }) => {
          if (loading) return null;
          if (!data) return null;

          const { user: { profilePictureUrl, fullName } } = data;

          return (
            <Dropdown isOpen={dropdownOpen} toggle={this.handleToggle}>
              <StyledDropdownToggle
                tag="div"
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
                nav
              >
                <AvatarWithPointer src={profilePictureUrl} size={40} />
              </StyledDropdownToggle>
              <StyledDropdownMenu>
                <DropdownItem header>{fullName}</DropdownItem>
                <DropdownItem divider />
                <StyledDropdownItem onClick={this.handleLogout}>
                  Log Out
                </StyledDropdownItem>
              </StyledDropdownMenu>
            </Dropdown>
          );
        }}
      </Query>
    );
  }
}

export default withApollo(AvatarDropdown);
