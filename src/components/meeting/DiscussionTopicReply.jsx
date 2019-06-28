import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';

import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import createConversationMessageMutation from 'graphql/createConversationMessageMutation';
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { getLocalUser, matchCurrentUserId } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import RovalEditor from 'components/shared/RovalEditor';
import ContentToolbar from './ContentToolbar';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: mode === 'display' ? colors.formGrey : 'none',
  padding: '20px 30px 25px',
  width: '100%',
}));

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  flexShrink: 0,
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const HeaderSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Details = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
});

const Author = styled.span(({ mode }) => ({
  fontSize: '14px',
  fontWeight: 600,
  marginRight: '20px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const ReplyEditor = styled(RovalEditor)({
  fontSize: '14px',
  lineHeight: '22px',
  fontWeight: 400,
  marginTop: '10px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

class DiscussionTopicReply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      mode: props.initialMode,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  async componentDidMount() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    // Assumes that currentUserQuery is already run once from <AvatarDropdown />
    const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });
    this.setState({ currentUser: user });
  }

  async handleSubmit({ payload, text }) {
    const { mode } = this.state;
    const mutation = mode === 'compose'
      ? createConversationMessageMutation : updateConversationMessageMutation;
    const {
      client,
      conversationId,
      meetingId,
      message,
      afterSubmit,
    } = this.props;

    const response = await client.mutate({
      mutation,
      variables: {
        id: conversationId,
        mid: message.id,
        input: {
          meetingId,
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (response.data) {
      afterSubmit();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to save discussion topic reply'));
  }

  handleCancel() {
    const { onCancelCompose } = this.props;
    const { mode } = this.state;
    if (mode === 'edit') this.toggleEditMode();
    if (mode === 'compose') onCancelCompose();
  }

  toggleEditMode() {
    this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
  }

  render() {
    const { currentUser, mode } = this.state;
    const {
      conversationId,
      meetingId,
      message: {
        author,
        body,
        createdAt,
        updatedAt,
      },
      onCancelCompose,
      ...props
    } = this.props;

    const replyAuthor = author || currentUser;
    if (!replyAuthor) return null;

    return (
      <Container mode={mode} {...props}>
        <AvatarWithMargin src={replyAuthor.profilePictureUrl} size={36} mode={mode} />
        <MainContainer>
          <HeaderSection>
            <Details>
              <Author mode={mode}>{replyAuthor.fullName}</Author>
              {mode === 'display' && (
                <ContentToolbar
                  createdAt={createdAt}
                  isEditable={matchCurrentUserId(author.id)}
                  isEdited={createdAt !== updatedAt}
                  onEdit={this.toggleEditMode}
                />
              )}
            </Details>
          </HeaderSection>
          <ReplyEditor
            initialContent={mode !== 'compose' ? body.payload : null}
            mode={mode}
            onCancel={this.handleCancel}
            onSubmit={this.handleSubmit}
            source="discussionTopicReply"
          />
        </MainContainer>
      </Container>
    );
  }
}

DiscussionTopicReply.propTypes = {
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  initialMode: PropTypes.oneOf(['compose', 'display']),
  meetingId: PropTypes.string.isRequired,
  message: PropTypes.object,
  afterSubmit: PropTypes.func,
  onCancelCompose: PropTypes.func,
};

DiscussionTopicReply.defaultProps = {
  initialMode: 'display',
  message: {},
  onCancelCompose: () => {},
  afterSubmit: () => {},
};

export default withApollo(DiscussionTopicReply);
