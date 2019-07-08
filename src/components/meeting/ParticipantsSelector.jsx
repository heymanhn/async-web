import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import fakeMembersQuery from 'graphql/fakeMembersQuery';

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
  }

  async componentDidMount() {
    const { client } = this.props;

    const response = await client.query({ query: fakeMembersQuery });

    if (response.data && response.data.fakeMembers) {
      const { fakeMembers: members } = response.data;
      this.setState({ members });
    }
  }

  // TODO
  handleAction(id) {
    const { participants } = this.state;
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

  render() {
    const { isOpen, members, participants } = this.state;
    const isParticipant = memberId => participants.findIndex(p => p.id === memberId) >= 0;

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
        {isOpen && (
          <MembersList>
            {members.map(member => (
              <Member
                key={member.id}
                fullName={member.fullName}
                id={member.id}
                isOrganizer={member.id === participants[0].id}
                isParticipant={isParticipant(member.id)}
                onAction={this.handleAction}
                profilePictureUrl={member.profilePictureUrl}
              />
            ))}
          </MembersList>
        )}
      </Container>
    );
  }
}

ParticipantsSelector.propTypes = {
  client: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
};


export default withApollo(ParticipantsSelector);
