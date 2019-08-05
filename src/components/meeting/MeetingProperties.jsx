import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { Query } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';

import ParticipantsSelector from './ParticipantsSelector';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: '20px',
  margin: '0 15px',
}));

const ParticipantsIndicator = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const ParticipantsButton = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'pointer',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '16px',
  marginRight: '10px',
}));

const NumberOfParticipants = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const StyledParticipantsSelector = styled(ParticipantsSelector)({
  position: 'absolute',
  top: '60px',
});

class MeetingProperties extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isParticipantSelectorOpen: false,
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.showParticipantsDropdown = this.showParticipantsDropdown.bind(this);
  }

  handleClickOutside(event) {
    event.stopPropagation();

    this.setState({ isParticipantSelectorOpen: false });
  }

  showParticipantsDropdown() {
    this.setState({ isParticipantSelectorOpen: true });
  }

  render() {
    const { isParticipantSelectorOpen } = this.state;
    const { meetingId } = this.props;

    return (
      <Query
        query={meetingQuery}
        variables={{ id: meetingId }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error || !data.meeting) return <div>{error}</div>;

          const { author, participants } = data.meeting;
          return (
            <Container>
              <VerticalDivider />
              <ParticipantsIndicator>
                <ParticipantsButton
                  className="ignore-react-onclickoutside"
                  onClick={this.showParticipantsDropdown}
                >
                  <StyledIcon icon={faUser} />
                  <NumberOfParticipants>{participants.length}</NumberOfParticipants>
                </ParticipantsButton>
                {isParticipantSelectorOpen && (
                  <StyledParticipantsSelector
                    alwaysOpen
                    authorId={author.id}
                    meetingId={meetingId}
                    participants={participants.map(p => p.user)}
                  />
                )}
              </ParticipantsIndicator>
            </Container>
          );
        }}
      </Query>
    );
  }
}

MeetingProperties.propTypes = {
  meetingId: PropTypes.string.isRequired,
};

export default onClickOutside(MeetingProperties);
