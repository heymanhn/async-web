/* eslint react/no-did-update-set-state: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';
import fakeMembersQuery from 'graphql/fakeMembersQuery';
import addParticipantMutation from 'graphql/addParticipantMutation';
import removeParticipantMutation from 'graphql/removeParticipantMutation';

import ParticipantAvatars from 'components/shared/ParticipantAvatars';

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

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const MembersList = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '0 0 5px 5px',
  borderTop: 'none',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  marginLeft: '-15px',
  marginTop: '10px',
  position: 'absolute',
  width: '320px',
}));

const WhiteSeparator = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  height: '10px',
  marginTop: '-2px',
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
      members: [],
      isOpen: false,
    };

    this.handleAction = this.handleAction.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addParticipant = this.addParticipant.bind(this);
    this.isParticipant = this.isParticipant.bind(this);
    this.removeParticipant = this.removeParticipant.bind(this);
    this.sortMembers = this.sortMembers.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;

    const response = await client.query({ query: fakeMembersQuery });

    if (response.data && response.data.fakeMembers) {
      const { fakeMembers: members } = response.data;
      this.setState({ members });
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
        if (meeting.participants.findIndex(p => p.user.id === id) >= 0) return;

        meeting.participants = meeting.participants.concat({
          user: member,
          __typename: '[Participant]',
        });
        cache.writeQuery({
          query: meetingQuery,
          variables: { id: meetingId },
          data: { meeting },
        });
      },
    });
  }

  isParticipant(id) {
    const { participants } = this.props;
    return participants.findIndex(p => p.id === id) >= 0;
  }

  removeParticipant(id) {
    const { client, meetingId, participants } = this.props;

    return client.mutate({
      mutation: removeParticipantMutation,
      variables: {
        id: meetingId,
        userId: id,
      },
      update: (cache) => {
        const index = participants.findIndex(p => p.id === id);
        const { meeting } = cache.readQuery({ query: meetingQuery, variables: { id: meetingId } });
        if (index >= 0) participants.splice(index, 1);

        meeting.participants = participants.map(p => ({ user: p, __typename: '[Participant]' }));
        cache.writeQuery({
          query: meetingQuery,
          variables: { id: meetingId },
          data: { meeting },
        });
      },
    });
  }

  sortMembers() {
    const { members } = this.state;
    const { authorId } = this.props;
    if (!members.length) return [];

    const meetingOrganizer = members.find(l => l.id === authorId);
    const others = members.filter(l => l.id !== authorId);

    return [meetingOrganizer, ...others];
  }

  render() {
    const { isOpen } = this.state;
    const { authorId, participants } = this.props;
    const members = this.sortMembers();

    return (
      <Container
        isOpen={isOpen}
        onBlur={this.handleClose}
        onClick={this.handleOpen}
        onFocus={this.handleOpen}
        tabIndex={0}
      >
        <div>
          <Title>PARTICIPANTS</Title>
          <ParticipantAvatars authorId={authorId} participants={participants} />
        </div>
        {!!members.length && (
          <MembersList isOpen={isOpen}>
            <WhiteSeparator />
            <InnerMembersContainer>
              {members.map(member => (
                <Member
                  key={member.id}
                  fullName={member.fullName}
                  id={member.id}
                  isOrganizer={member.id === authorId}
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
  authorId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
  meetingId: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
};

export default withApollo(ParticipantsSelector);
