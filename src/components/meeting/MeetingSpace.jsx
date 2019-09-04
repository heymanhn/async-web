import React, { createRef, Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import meetingQuery from 'graphql/queries/meeting';
import withViewedReaction from 'utils/withViewedReaction';

import DiscussionsList from './DiscussionsList';
import DiscussionComposer from './DiscussionComposer';
import DiscussionThread from './DiscussionThread';
import TitleBar from './TitleBar';

const Container = styled.div({
  marginBottom: '60px',
});

const DiscussionsContainer = styled.div(({ theme: { meetingSpaceViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',

  margin: '0 auto',
  maxWidth: meetingSpaceViewport,
  padding: '30px',
}));

const LeftColumn = styled.div({
  maxHeight: 'calc(100vh - 101px)',
  overflow: 'auto',
  position: 'fixed',
});

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

const MainColumn = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  margin: '0 20px 0 500px',
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

    this.listRef = createRef();
    this.handleCancelCompose = this.handleCancelCompose.bind(this);
    this.handleCreateDiscussion = this.handleCreateDiscussion.bind(this);
    this.handleScrollToCell = this.handleScrollToCell.bind(this);
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

  handleScrollToCell(targetElement) {
    const element = this.listRef.current;

    if (!element) {
      // The ref would be around by the next cycle
      setTimeout(() => this.handleScrollToCell(targetElement), 0);
      return;
    }

    // Give it some breathing room at the top
    element.scrollTo({ top: targetElement.offsetTop - 200 });
  }

  handleSelectConversation(conversationId) {
    const { markAsRead } = this.props;
    markAsRead(conversationId);

    this.setState({ isComposing: false, selectedConversationId: conversationId });
  }

  findSelectedConversation(conversations) {
    const { selectedConversationId } = this.state;
    const { conversationId, markAsRead } = this.props;

    if (!conversations) return {};
    if (conversationId && !selectedConversationId) {
      markAsRead(conversationId);
      return conversations.find(c => c.id === conversationId);
    }
    if (!selectedConversationId && conversations.length) return conversations[0];
    return conversations.find(c => c.id === selectedConversationId) || {};
  }

  resetDisplayURL() {
    const { meetingId } = this.props;
    const url = `${origin}/spaces/${meetingId}`;
    window.history.replaceState({}, `meeting space: ${meetingId}`, url);
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
    const { meetingId } = this.props;
    const { origin } = window.location;

    if (!selectedConversationId) return this.resetDisplayURL();

    const url = `${origin}/spaces/${meetingId}/conversations/${selectedConversationId}`;
    return window.history.replaceState({}, `conversation: ${selectedConversationId}`, url);
  }

  render() {
    const { conversationId, meetingId } = this.props;

    return (
      <Query
        query={meetingQuery}
        variables={{ id: meetingId }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error || !data.meeting) return <div>{error}</div>;

          const { conversations, title } = data.meeting;

          return (
            <Container>
              <TitleBar meetingId={meetingId} title={title} />
              <DiscussionsContainer>
                Hello
              </DiscussionsContainer>
              {/* <LeftColumn>
                <StartDiscussionButton onClick={this.handleCreateDiscussion}>
                  <ButtonLabel>Start a discussion</ButtonLabel>
                  <PlusSign>+</PlusSign>
                </StartDiscussionButton>
                <DiscussionsContainer ref={this.listRef}>
                  <DiscussionsList
                    meetingId={meetingId}
                    onScrollTo={isFirstLoadWithConvoParam ? this.handleScrollToCell : undefined}
                    onSelectConversation={this.handleSelectConversation}
                    selectedConversationId={isComposing ? null : selectedConvo.id}
                  />
                </DiscussionsContainer>
              </LeftColumn> */}
              {/* <MainColumn>
                {showComposer ? (
                  <StyledDiscussionComposer
                    afterSubmit={this.showCreatedConversation}
                    hideCancelButton={hideCancelButton}
                    meetingId={meetingId}
                    onCancelCompose={this.handleCancelCompose}
                  />
                ) : (
                  <StyledDiscussionThread
                    conversationId={selectedConvo.id}
                    conversationTitle={selectedConvo.title}
                    meetingId={meetingId}
                  />
                )}
              </MainColumn> */}
            </Container>
          );
        }}
      </Query>
    );
  }
}

MeetingSpace.propTypes = {
  conversationId: PropTypes.string, // conversation Id
  markAsRead: PropTypes.func.isRequired,
  meetingId: PropTypes.string.isRequired,
};

MeetingSpace.defaultProps = {
  conversationId: null,
};

export default withViewedReaction(MeetingSpace);
