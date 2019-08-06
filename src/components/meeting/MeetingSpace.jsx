import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/meetingQuery';

import Layout from 'components/Layout';
import DiscussionsList from './DiscussionsList';
import DiscussionComposer from './DiscussionComposer';
import DiscussionThread from './DiscussionThread';

const Container = styled.div(({ theme: { wideViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',

  maxHeight: 'calc(100vh - 70px)',
  margin: '0 auto',
  maxWidth: wideViewport,
  overflow: 'hidden',
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

const DiscussionsContainer = styled.div({
  height: 'calc(100vh - 148px)', // 70px nav bar, 30px margin, 48px start disucssion button
  overflow: 'auto',
});

const MainColumn = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  height: 'calc(100vh - 100px)',
  overflow: 'auto',
  overflowX: 'hidden',
  margin: '0 20px',
}));

const StyledDiscussionComposer = styled(DiscussionComposer)({
  maxWidth: '700px',
  width: '700px',
});

const StyledDiscussionThread = styled(DiscussionThread)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderTop: 'none',
  marginBottom: '30px',
  maxWidth: '700px',
  width: '700px',
}));

class MeetingSpace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isComposing: false,
      selectedConversationId: null,
    };

    this.handleCancelCompose = this.handleCancelCompose.bind(this);
    this.handleCreateDiscussion = this.handleCreateDiscussion.bind(this);
    this.handleSelectConversation = this.handleSelectConversation.bind(this);
    this.findSelectedConversation = this.findSelectedConversation.bind(this);
    this.resetDisplayURL = this.resetDisplayURL.bind(this);
    this.showCreatedConversation = this.showCreatedConversation.bind(this);
    this.updateDisplayURL = this.updateDisplayURL.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isComposing, selectedConversationId: cid } = this.state;

    const switchConvo = cid && (cid !== prevState.selectedConversationId);
    const cancelCompose = !isComposing && prevState.isComposing; // WHAT HAPPENED HERE?
    if (switchConvo || cancelCompose) this.updateDisplayURL();

    const switchToCompose = isComposing && !prevState.isComposing;
    const clearSelectedConvo = !cid && prevState.selectedConversationId;
    if (switchToCompose || clearSelectedConvo) this.resetDisplayURL();
  }

  handleCancelCompose() {
    this.setState({ isComposing: false });
  }

  handleCreateDiscussion() {
    this.setState({ isComposing: true });
  }

  handleSelectConversation(conversationId) {
    this.setState({ isComposing: false, selectedConversationId: conversationId });
  }

  findSelectedConversation(conversations) {
    const { selectedConversationId } = this.state;
    const { cid } = this.props;

    if (cid && !selectedConversationId) return conversations.find(c => c.id === cid);
    if (!selectedConversationId && conversations.length) return conversations[0];
    return conversations.find(c => c.id === selectedConversationId);
  }

  resetDisplayURL() {
    const { id } = this.props;
    const url = `${origin}/spaces/${id}`;
    window.history.replaceState({}, `meeting space: ${id}`, url);
  }

  async showCreatedConversation(conversationId) {
    this.setState({
      isComposing: false,
      selectedConversationId: conversationId,
    });
  }

  // Updates the URL in the address bar to reflect this discussion
  // https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries
  updateDisplayURL() {
    const { selectedConversationId } = this.state;
    const { id } = this.props;
    const { origin } = window.location;

    const url = `${origin}/spaces/${id}/conversations/${selectedConversationId}`;
    window.history.replaceState({}, `conversation: ${selectedConversationId}`, url);
  }

  render() {
    const { isComposing } = this.state;
    const { id } = this.props;

    return (
      <Query
        query={meetingQuery}
        variables={{ id }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error || !data.meeting) return <div>{error}</div>;

          const { conversations, title } = data.meeting;
          const showComposer = isComposing || !conversations;
          const selectedConvo = this.findSelectedConversation(conversations);

          return (
            <Layout
              hideFooter
              meetingId={id}
              mode="wide"
              title={title || 'Untitled Discussion'}
            >
              <Container>
                <div>
                  <StartDiscussionButton onClick={this.handleCreateDiscussion}>
                    <ButtonLabel>Start a discussion</ButtonLabel>
                    <PlusSign>+</PlusSign>
                  </StartDiscussionButton>
                  <DiscussionsContainer>
                    <DiscussionsList
                      conversations={conversations || []}
                      onSelectConversation={this.handleSelectConversation}
                      selectedConversationId={isComposing ? null : selectedConvo.id}
                    />
                  </DiscussionsContainer>
                </div>
                <MainColumn>
                  {showComposer ? (
                    <StyledDiscussionComposer
                      afterSubmit={this.showCreatedConversation}
                      meetingId={id}
                      onCancelCompose={this.handleCancelCompose}
                    />
                  ) : (
                    <StyledDiscussionThread
                      conversation={selectedConvo}
                      meetingId={id}
                    />
                  )}
                </MainColumn>
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
  cid: PropTypes.string, // conversation Id
};

MeetingSpace.defaultProps = {
  cid: null,
};

export default MeetingSpace;
