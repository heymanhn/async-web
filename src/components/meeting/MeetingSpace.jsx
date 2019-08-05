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
  margin: '0 20px',
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
    this.showCreatedConversation = this.showCreatedConversation.bind(this);
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

    if (!selectedConversationId && conversations.length) return conversations[0];
    return conversations.find(c => c.id === selectedConversationId);
  }

  async showCreatedConversation(conversationId) {
    this.setState({
      isComposing: false,
      selectedConversationId: conversationId,
    });
  }

  render() {
    const { isComposing, selectedConversationId } = this.state;
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
                      selectedConversationId={selectedConversationId}
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
                      conversation={this.findSelectedConversation(conversations)}
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
};

export default MeetingSpace;
