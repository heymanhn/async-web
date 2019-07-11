/* eslint react/no-did-update-set-state: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import styled from '@emotion/styled';
import Moment from 'react-moment';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

import RovalEditor from 'components/editor/RovalEditor';
import DiscussionTopic from './DiscussionTopic';
import ParticipantsSelector from './ParticipantsSelector';

const MetadataContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const MetadataSection = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '40px 20px',
}));

const InfoContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '20px',
});

const DeadlineSelector = styled.div({
  marginTop: '15px',
  width: '300px',
});

const DeadlineTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const DiscussionSection = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
}));

const InnerContainer = styled.div(({ theme: { maxViewport } }) => ({
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '30px 20px',
}));

const DiscussionsLabel = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  marginTop: '30px',
  marginBottom: '20px',
});

const AddDiscussionButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
}));

const PlusSign = styled.span(({ theme: { colors } }) => ({
  fontSize: '26px',
  fontWeight: 400,
  paddingRight: '5px',
  position: 'relative',
  top: '1px',

  ':hover': {
    color: colors.grey2,
  },
}));

const DiscussionButtonText = styled.span(({ theme: { colors } }) => ({
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '25px',

  ':hover': {
    color: colors.grey2,
    textDecoration: 'underline',
  },
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  fontSize: '36px',
  fontWeight: 600,
  color: colors.mainText,
  marginBottom: '15px',
  width: '100%',
  outline: 'none',
}));

const DetailsEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },

  h1: {
    fontSize: '28px',
    fontWeight: 600,
    marginTop: '1.4em',
  },

  h2: {
    fontSize: '24px',
    fontWeight: 500,
    marginTop: '1.3em',
  },

  h3: {
    fontSize: '20px',
    fontWeight: 500,
    marginTop: '1.2em',
  },
}));

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '16px',
}));

class Meeting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isComposingTopic: false,
      isModalInitiallyDisplayed: false,
    };

    this.handleSubmitTitle = this.handleSubmitTitle.bind(this);
    this.handleSubmitDetails = this.handleSubmitDetails.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleComposeMode = this.toggleComposeMode.bind(this);
    this.resetDisplayOverride = this.resetDisplayOverride.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { cid } = this.props;
    if (cid && prevProps.cid !== cid) this.setState({ isModalInitiallyDisplayed: false });
  }

  async handleSubmitTitle({ text }) {
    await this.handleSubmit({ text, type: 'title' });
  }

  async handleSubmitDetails({ payload, text }) {
    await this.handleSubmit({ payload, text, type: 'details' });
  }

  async handleSubmit({ payload, text, type } = {}) {
    const { client, id } = this.props;
    const input = type === 'title' ? { title: text } : {
      body: {
        formatter: 'slatejs',
        text,
        payload,
      },
    };

    const response = await client.mutate({
      mutation: updateMeetingMutation,
      variables: { id, input },
    });

    if (response.data) {
      client.writeData({ data: { saveStatus: 'success' } });
      setTimeout(() => client.writeData({ data: { saveStatus: null } }), 2000);
      return Promise.resolve();
    }

    return Promise.reject(new Error(`Failed to save meeting ${type}`));
  }

  toggleComposeMode() {
    this.setState(prevState => ({ isComposingTopic: !prevState.isComposingTopic }));
  }

  // Passed into Discussion Topic components so that after one of the modals is opened
  // via navigation to /meetings/:id/conversations/:cid, this method can be called to
  // not force the modal open after the user closes it.
  resetDisplayOverride() {
    this.setState({ isModalInitiallyDisplayed: true });
  }

  render() {
    const { isComposingTopic, isModalInitiallyDisplayed } = this.state;
    const { id, cid } = this.props;

    const addDiscussionButton = (
      <AddDiscussionButton onClick={this.toggleComposeMode}>
        <PlusSign>+</PlusSign>
        <DiscussionButtonText>ADD DISCUSSION TOPIC</DiscussionButtonText>
      </AddDiscussionButton>
    );

    return (
      <Query
        query={meetingQuery}
        variables={{ id }}
      >
        {({ loading, error, data, refetch }) => {
          if (loading && !data) return null;
          if (error || !data.meeting) return <div>{error}</div>;

          const { author, body, conversations, deadline, participants, title } = data.meeting;
          const conversationIds = (conversations || []).map(c => c.id);

          return (
            <React.Fragment>
              <MetadataContainer>
                <MetadataSection>
                  <TitleEditor
                    initialValue={title}
                    isPlainText
                    onSubmit={this.handleSubmitTitle}
                    saveOnBlur
                    source="meetingTitle"
                  />
                  <InfoContainer>
                    <ParticipantsSelector
                      authorId={author.id}
                      meetingId={id}
                      participants={participants.map(p => p.user)}
                    />
                    <DeadlineSelector>
                      <DeadlineTitle>DUE</DeadlineTitle>
                      <Timestamp fromNow parse="X">{deadline}</Timestamp>
                    </DeadlineSelector>
                  </InfoContainer>
                  <DetailsEditor
                    initialValue={body ? body.payload : null}
                    onSubmit={this.handleSubmitDetails}
                    saveOnBlur
                    source="meetingDetails"
                  />
                </MetadataSection>
              </MetadataContainer>
              <DiscussionSection>
                <InnerContainer>
                  {conversationIds.length > 0 && <DiscussionsLabel>DISCUSSION</DiscussionsLabel>}
                  {conversationIds.map(conversationId => (
                    <DiscussionTopic
                      afterSubmit={() => refetch()}
                      conversationId={conversationId}
                      forceDisplayModal={cid === conversationId && !isModalInitiallyDisplayed}
                      initialMode="display"
                      key={conversationId}
                      meetingId={id}
                      resetDisplayOverride={this.resetDisplayOverride}
                    />
                  ))}
                  {!isComposingTopic ? addDiscussionButton : (
                    <DiscussionTopic
                      afterSubmit={() => refetch()}
                      initialMode="compose"
                      meetingId={id}
                      onCancelCompose={this.toggleComposeMode}
                    />
                  )}
                </InnerContainer>
              </DiscussionSection>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

Meeting.propTypes = {
  client: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  cid: PropTypes.string,
};

Meeting.defaultProps = { cid: null };

export default withApollo(withPageTracking(Meeting, 'Meeting'));
