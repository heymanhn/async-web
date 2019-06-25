import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import styled from '@emotion/styled';

import menuIcon from 'images/icons/menu.png';

const StyledImg = styled.img({
  width: '26px',
  height: 'auto',
});

const StyledDropdownToggle = styled(DropdownToggle)({
  cursor: 'pointer',
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
  fontSize: '14px',

  a: {
    color: `${colors.mainText} !important`,
  },

  ':hover, :active': {
    background: colors.hoverBlue,
    color: colors.mainText,
    outline: 'none',
  },
}));

class DiscussionTopicMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle() {
    this.setState(prevState => ({ dropdownOpen: !prevState.dropdownOpen }));
  }

  render() {
    const { dropdownOpen } = this.state;
    const { onEdit } = this.props;

    return (
      <Dropdown isOpen={dropdownOpen} toggle={this.handleToggle}>
        <StyledDropdownToggle
          tag="div"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
          nav
        >
          <StyledImg alt="Menu" src={menuIcon} />
        </StyledDropdownToggle>
        <StyledDropdownMenu>
          <StyledDropdownItem onClick={onEdit}>
            Edit Topic
          </StyledDropdownItem>
        </StyledDropdownMenu>
      </Dropdown>
    );
  }
}

DiscussionTopicMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
};

export default DiscussionTopicMenu;
