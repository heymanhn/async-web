import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';

import Layout from 'components/Layout';
import DiscussionsList from './DiscussionsList';
import DiscussionComposer from './DiscussionComposer';
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

const StyledDiscussionComposer = styled(DiscussionComposer)({
  margin: '0 20px',
  maxWidth: '700px',
  width: '700px',
});

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

    this.state = {
      conversations: null,
      isComposing: false,
      selectedConversationId: null,
      title: null,
    };

    this.handleCreateDiscussion = this.handleCreateDiscussion.bind(this);
    this.handleSelectConversation = this.handleSelectConversation.bind(this);
    this.fetchMeetingData = this.fetchMeetingData.bind(this);
    this.findSelectedConversation = this.findSelectedConversation.bind(this);
    this.showCreatedConversation = this.showCreatedConversation.bind(this);
  }

  async componentDidMount() {
    const { conversations, title } = await this.fetchMeetingData();
    this.setState({
      conversations,
      selectedConversationId: conversations.length ? conversations[0].id : null,
      title,
    });
  }

  handleCreateDiscussion() {
    this.setState({ isComposing: true });
  }

  handleSelectConversation(conversationId) {
    this.setState({ isComposing: false, selectedConversationId: conversationId });
  }

  async fetchMeetingData() {
    const { client, id } = this.props;
    const response = await client.query({
      query: meetingQuery,
      variables: { id },
      fetchPolicy: 'no-cache',
    });

    if (response.data) {
      const { conversations, title } = response.data.meeting;
      return { conversations: conversations || [], title: title || 'Untitled Discussion' };
    }

    return new Error('Error fetching meeting data');
  }

  findSelectedConversation(conversations) {
    const { selectedConversationId } = this.state;
    return conversations.find(c => c.id === selectedConversationId);
  }

  async showCreatedConversation(conversationId) {
    const { conversations, title } = await this.fetchMeetingData();

    this.setState({
      conversations,
      isComposing: false,
      selectedConversationId: conversationId,
      title,
    });
  }

  render() {
    const {
      conversations,
      isComposing,
      selectedConversationId,
      title,
    } = this.state;

    const { id } = this.props;
    if (!conversations || !title) return null;

    const showComposer = isComposing || !conversations.length;

    return (
      <Layout mode="wide" title={title}>
        <Container>
          <div>
            <StartDiscussionButton onClick={this.handleCreateDiscussion}>
              <ButtonLabel>Start a discussion</ButtonLabel>
              <PlusSign>+</PlusSign>
            </StartDiscussionButton>
            <DiscussionsList
              conversations={conversations}
              onSelectConversation={this.handleSelectConversation}
              selectedConversationId={selectedConversationId}
            />
          </div>
          {showComposer ? (
            <StyledDiscussionComposer
              afterSubmit={this.showCreatedConversation}
              meetingId={id}
            />
          ) : (
            <StyledDiscussionThread
              conversation={this.findSelectedConversation(conversations)}
              meetingId={id}
            />
          )}
        </Container>
      </Layout>
    );
  }
}

MeetingSpace.propTypes = {
  client: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
};

export default withApollo(MeetingSpace);
