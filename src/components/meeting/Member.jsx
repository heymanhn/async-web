import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import withHover from 'utils/withHover';

import Avatar from 'components/shared/Avatar';

const MemberContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Details = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const StyledAvatar = styled(Avatar)({

});

const Name = styled.div({
  fontSize: '14px',
});

const MetadataContainer = styled.div({

});

const OrganizerLabel = styled.span(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '12px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ hover, theme: { colors } }) => ({
  color: hover === 'true' ? colors.white : colors.grey3,
  fontSize: '12px',
  margin: '5px 10px',
}));

// Assumes that the meeting organizer is the first participant in the array
class Member extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { id, handleAction } = this.props;
    handleAction(id);
  }

  render() {
    const {
      fullName,
      hover,
      isOrganizer,
      isParticipant,
      profilePictureUrl,
      ...props
    } = this.props;

    return (
      <MemberContainer onClick={this.handleClick} {...props}>
        <Details>
          <StyledAvatar src={profilePictureUrl} size={30} />
          <Name>{fullName}</Name>
        </Details>
        <MetadataContainer>
          {isOrganizer ? (
            <OrganizerLabel>organizer</OrganizerLabel>
          ) : (isParticipant && <StyledIcon hover={hover.toString()} icon={faCheck} />)}
        </MetadataContainer>
      </MemberContainer>
    );
  }
}

Member.propTypes = {
  fullName: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  hover: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  isOrganizer: PropTypes.bool.isRequired,
  isParticipant: PropTypes.bool.isRequired,
  profilePictureUrl: PropTypes.string.isRequired,
};

export default withHover(Member);
