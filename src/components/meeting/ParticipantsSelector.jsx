/* eslint react/no-did-update-set-state: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';
import fakeMembersQuery from 'graphql/fakeMembersQuery';
import addParticipantMutation from 'graphql/addParticipantMutation';
import removeParticipantMutation from 'graphql/removeParticipantMutation';

import Avatar from 'components/shared/Avatar';
import Member from './Member';

const Container = styled.div(({ theme: { colors } }) => ({
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '-15px',
  marginRight: '20px',
  outline: 'none',
  padding: '15px',
  width: '320px',
  zIndex: 1000,

  ':hover,:focus': {
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    padding: '14px',
  },

  ':focus': {
    borderBottom: 'none',
    borderRadius: '5px 5px 0 0',
  },
}));

const ParticipantsDisplay = styled.div({
  marginBottom: '10px',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const StyledAvatar = styled(Avatar)({
  display: 'inline-block',
  marginRight: '-4px',
});

const MembersList = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '0 0 5px 5px',
  borderTop: 'none',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  marginLeft: '-15px',
  position: 'absolute',
  width: '320px',
}));

// Needed for a CSS trick to hide the box shadow at the top of the absolute positioned element
const InnerMembersContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  borderRadius: '0 0 5px 5px',
  padding: '10px 0',
  marginTop: '-2px',
}));

class ParticipantsSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      members: null,
      isOpen: false,
      participants: props.participants,
    };

    this.handleAction = this.handleAction.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.isParticipant = this.isParticipant.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;

    const response = await client.query({ query: fakeMembersQuery });

    if (response.data && response.data.fakeMembers) {
      const { fakeMembers: members } = response.data;
      this.setState({ members });
    }
  }

  componentDidUpdate() {
    const { participants } = this.state;
    const { participants: newParticipants } = this.props;
    if (participants.length !== newParticipants.length) {
      this.setState({ participants: newParticipants });
    }
  }

  async handleAction(id) {
    return this.isParticipant(id) ? this.removeParticipant(id) : this.addParticipant(id);
  }

  handleClose() {
    const { isOpen } = this.state;
    if (!isOpen) return;

    this.setState({ isOpen: false });
  }

  handleOpen() {
    const { isOpen } = this.state;
    if (isOpen) return;

    this.setState({ isOpen: true });
  }

  addParticipant(id) {
    const { members } = this.state;
    const { client, meetingId } = this.props;

    return client.mutate({
      mutation: addParticipantMutation,
      variables: {
        id: meetingId,
        input: {
          userId: id,
          accessType: 'collaborator',
        },
      },
      update: (cache) => {
        const member = members.find(m => m.id === id);
        const { meeting } = cache.readQuery({ query: meetingQuery, variables: { id: meetingId } });
        meeting.participants = meeting.participants.contact(member);
        cache.writeQuery({
          query: meetingQuery,
          variables: { id: meetingId },
          data: { meeting },
        });
      },
    });
  }

  isParticipant(id) {
    const { participants } = this.state;
    return participants.findIndex(p => p.id === id) >= 0;
  }

  async removeParticipant(id) {
    const { client, meetingId } = this.props;

    const response = await client.mutate({
      mutation: removeParticipantMutation,
      variables: {
        id: meetingId,
        input: {
          userId: id,
        },
      },
    });
  }

  render() {
    const { isOpen, members, participants } = this.state;

    return (
      <Container
        isOpen={isOpen}
        onBlur={this.handleClose}
        onClick={this.handleOpen}
        onFocus={this.handleOpen}
        tabIndex={0}
      >
        <ParticipantsDisplay>
          <Title>PARTICIPANTS</Title>
          {participants.map(p => (
            <StyledAvatar key={p.id} src={p.profilePictureUrl} size={30} alt={p.fullName} />
          ))}
        </ParticipantsDisplay>
        {members && (
          <MembersList>
            <InnerMembersContainer>
              {members.map(member => (
                <Member
                  key={member.id}
                  fullName={member.fullName}
                  id={member.id}
                  isOrganizer={member.id === participants[0].id}
                  isParticipant={this.isParticipant(member.id)}
                  handleAction={this.handleAction}
                  profilePictureUrl={member.profilePictureUrl}
                  tabIndex={0}
                />
              ))}
            </InnerMembersContainer>
          </MembersList>
        )}
      </Container>
    );
  }
}

ParticipantsSelector.propTypes = {
  client: PropTypes.object.isRequired,
  meetingId: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
};

export default withApollo(ParticipantsSelector);
