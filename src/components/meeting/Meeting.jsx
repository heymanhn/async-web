import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import Plain from 'slate-plain-serializer';
import { Value } from 'slate';
import styled from '@emotion/styled';

import withPageTracking from 'utils/withPageTracking';
import { initialValue, titlePlugins, detailsPlugins } from 'utils/slateHelper';
import meetingQuery from 'graphql/meetingQuery';
import meetingConversationsQuery from 'graphql/meetingConversationsQuery';
import updateMeetingMutation from 'graphql/updateMeetingMutation';

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

const MeetingTitle = styled(Editor)(({ theme: { colors } }) => ({
  fontSize: '36px',
  fontWeight: 600,
  color: colors.mainText,
  marginBottom: '30px',
  width: '100%',
  outline: 'none',
}));

const MeetingDetails = styled(Editor)(({ theme: { colors } }) => ({
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
      conversationIds: [],
      details: '',
      error: false,
      isComposingTopic: false,
      loading: true,
      participants: [],
      title: '',
    };

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDetails = this.handleChangeDetails.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.toggleComposeMode = this.toggleComposeMode.bind(this);
    this.refetchConversations = this.refetchConversations.bind(this);
    this.resetDisplayOverride = this.resetDisplayOverride.bind(this);
  }

  async componentDidMount() {
    const { client, id, cid } = this.props;
    const response = await client.query({ query: meetingQuery, variables: { id } });

    if (response.data && response.data.meeting) {
      const { title, body, conversations, participants } = response.data.meeting;
      const deserializedTitle = Plain.deserialize(title);
      const details = body && body.formatter === 'slatejs'
        ? JSON.parse(body.payload) : initialValue;

      this.setState({
        loading: false,
        title: deserializedTitle,
        details: Value.fromJSON(details),
        participants,
        conversationIds: (conversations || []).map(c => c.id),
      });
    } else {
      this.setState({ error: true, loading: false });
    }
  }

  async refetchConversations() {
    const { client, id } = this.props;
    const response = await client.query({
      query: meetingConversationsQuery,
      variables: { id },
      fetchPolicy: 'no-cache',
    });

    if (response.data && response.data.conversationsQuery) {
      const { conversations } = response.data.conversationsQuery;

      this.setState({ conversationIds: (conversations || []).map(c => c.id) });
    } else {
      this.setState({ error: true });
    }
  }

  handleChangeTitle({ value }) {
    this.setState({ title: value });
  }

  handleChangeDetails({ value }) {
    this.setState({ details: value });
  }

  async handleSave(event, editor, next) {
    const { title, details } = this.state;
    const { client, id } = this.props;
    const plainTextTitle = Plain.serialize(title);

    next();

    try {
      const response = await client.mutate({
        mutation: updateMeetingMutation,
        variables: {
          id,
          input: {
            title: plainTextTitle,
            body: {
              formatter: 'slatejs',
              text: Plain.serialize(details),
              payload: JSON.stringify(details.toJSON()),
            },
          },
        },
      });

      if (response.data && response.data.updateMeeting) {
        client.writeData({ data: { saveStatus: 'success' } });
        setTimeout(() => client.writeData({ data: { saveStatus: null } }), 2000);
      }
    } catch (err) {
      // No error handling yet
      console.log('error saving meeting');
      next();
    }
  }

  toggleComposeMode() {
    this.setState(prevState => ({ isComposingTopic: !prevState.isComposingTopic }));
  }

  // Passed into Discussion Topic components so that after one of the modals is opened
  // via navigation to /meetings/:id/conversations/:cid, this method can be called to
  // not force the modal open after the user closes it.
  resetDisplayOverride() {
    this.setState({ isModalDisplayed: true });
  }

  render() {
    const {
      conversationIds,
      details,
      error,
      isComposingTopic,
      isModalDisplayed,
      loading,
      participants,
      title,
    } = this.state;
    const { id, cid } = this.props;

    if (loading || error) return null;

    const addDiscussionButton = (
      <AddDiscussionButton onClick={this.toggleComposeMode}>
        <PlusSign>+</PlusSign>
        <DiscussionButtonText>ADD DISCUSSION TOPIC</DiscussionButtonText>
      </AddDiscussionButton>
    );

    return (
      <div>
        <MetadataContainer>
          <MetadataSection>
            <MeetingTitle
              onBlur={this.handleSave}
              onChange={this.handleChangeTitle}
              value={title}
              plugins={titlePlugins}
            />
            <MeetingInfo participants={participants} />
            {/* DRY this up later */}
            <MeetingDetails
              onBlur={this.handleSave}
              onChange={this.handleChangeDetails}
              value={details}
              plugins={detailsPlugins}
            />
          </MetadataSection>
        </MetadataContainer>
        <DiscussionSection>
          {conversationIds.length > 0 && <DiscussionsLabel>DISCUSSION</DiscussionsLabel>}
          {conversationIds.map(conversationId => (
            <DiscussionTopic
              key={conversationId}
              conversationId={conversationId}
              meetingId={id}
              mode="display"
              forceDisplayModal={cid === conversationId && !isModalDisplayed}
              resetDisplayOverride={this.resetDisplayOverride}
            />
          ))}
          {!isComposingTopic ? addDiscussionButton : (
            <DiscussionTopic
              meetingId={id}
              mode="compose"
              afterCreate={this.refetchConversations}
              onCancelCompose={this.toggleComposeMode}
            />
          )}
        </DiscussionSection>
      </div>
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
