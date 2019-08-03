import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';

import Layout from 'components/Layout';
import DiscussionsList from './DiscussionsList';
import DiscussionThread from './DiscussionThread';

const Container = styled.div(({ theme: { wideViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  margin: '0 auto',
  maxWidth: wideViewport,
  padding: '30px 0',
}));

const StartDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  cursor: 'pointer',
  height: '48px',
  marginLeft: '20px',
  padding: '0 30px',
  width: '460px', // Define as a constant elsewhere?
}));

const ButtonLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '16px',
  fontWeight: 500,
}));

const PlusSign = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '24px',
  fontWeight: 500,
  marginTop: '-4px',
}));

const StyledDiscussionThread = styled(DiscussionThread)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  margin: '0 20px',
  maxWidth: '700px',
  width: '700px',
}));

class MeetingSpace extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedConversationId: null };

    this.handleSelectConversation = this.handleSelectConversation.bind(this);
    this.findSelectedConversation = this.findSelectedConversation.bind(this);
  }

  handleSelectConversation(conversationId) {
    this.setState({ selectedConversationId: conversationId });
  }

  findSelectedConversation(conversations) {
    const { selectedConversationId } = this.state;

    if (!selectedConversationId) return conversations[0];
    return conversations.find(c => c.id === selectedConversationId);
  }

  render() {
    const { id } = this.props;

    return (
      <Query
        query={meetingQuery}
        variables={{ id }}
      >
        {({ loading, error, data }) => {
          if (loading && !data) return null;
          if (error || !data.meeting) return <div>{error}</div>;

          const { conversations, participants, title } = data.meeting;

          return (
            <Layout mode="wide" title={title}>
              <Container>
                <div>
                  <StartDiscussionButton>
                    <ButtonLabel>Start a discussion</ButtonLabel>
                    <PlusSign>+</PlusSign>
                  </StartDiscussionButton>
                  <DiscussionsList
                    conversations={conversations || []}
                    onSelectConversation={this.handleSelectConversation}
                  />
                </div>
                <StyledDiscussionThread
                  conversation={this.findSelectedConversation(conversations)}
                  meetingId={id}
                />
              </Container>
            </Layout>
          );
        }}
      </Query>
    );
  }
}

MeetingSpace.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MeetingSpace;