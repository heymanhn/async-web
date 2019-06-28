import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, withApollo } from 'react-apollo';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import meetingQuery from 'graphql/meetingQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

import RovalEditor from 'components/shared/RovalEditor';
import MeetingInfo from './MeetingInfo';
import DiscussionTopic from './DiscussionTopic';

const MetadataContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
}));

const MetadataSection = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
  padding: '60px 20px',
}));

const DiscussionSection = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.bgGrey,
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
  marginBottom: '30px',
  width: '100%',
  outline: 'none',
}));

const DetailsEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,

  div: {
    marginTop: '1em',
  },
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

          const { body, conversations, participants, title } = data.meeting;
          const conversationIds = (conversations || []).map(c => c.id);

          return (
            <React.Fragment>
              <MetadataContainer>
                <MetadataSection>
                  <TitleEditor
                    initialContent={title}
                    isPlainText
                    onSubmit={this.handleSubmitTitle}
                    saveOnBlur
                    source="meetingTitle"
                  />
                  <MeetingInfo participants={participants} />
                  <DetailsEditor
                    initialContent={body ? body.payload : null}
                    onSubmit={this.handleSubmitDetails}
                    saveOnBlur
                    source="meetingDetails"
                  />
                </MetadataSection>
              </MetadataContainer>
              <DiscussionSection>
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
