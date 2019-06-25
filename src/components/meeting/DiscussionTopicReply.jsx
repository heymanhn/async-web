import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import Moment from 'react-moment';
import isHotKey from 'is-hotkey';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import createConversationMessageMutation from 'graphql/createConversationMessageMutation';
import { initialValue, discussionTopicReplyPlugins } from 'utils/slateHelper';
import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ mode, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  background: mode === 'display' ? colors.formGrey : 'none',
  cursor: mode === 'display' ? 'pointer' : 'initial',
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
});

// HN: TODO - DRY these up with <DiscussionTopic />
const Author = styled.span(({ mode }) => ({
  fontSize: '14px',
  fontWeight: 600,
  marginRight: '20px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
}));

const ReplyButton = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: colors.blue,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  justifySelf: 'flex-end',
  opacity: isDisabled ? 0.5 : 1,
}));

const Content = styled(Editor)({
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

    const initialJSON = props.message ? JSON.parse(props.message) : initialValue;

    this.state = {
      author: props.author || null,
      message: Value.fromJSON(initialJSON),
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.isReplyEmpty = this.isReplyEmpty.bind(this);
  }

  async componentDidMount() {
    const { client, messageId } = this.props;
    const { userId } = getLocalUser();

    if (!messageId) {
      // Assumes that currentUserQuery is already run once from <AvatarDropdown />
      const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });
      this.setState({ author: user });
    }
  }

  handleChangeContent({ value }) {
    this.setState({ message: value });
  }

  async handleCreate({ hideCompose = true } = {}) {
    const { message } = this.state;
    if (this.isReplyEmpty()) return;

    const { client, conversationId, meetingId, onCancelCompose, afterCreate } = this.props;

    const response = await client.mutate({
      mutation: createConversationMessageMutation,
      variables: {
        id: conversationId,
        input: {
          meetingId,
          body: {
            formatter: 'slatejs',
            text: Plain.serialize(message),
            payload: JSON.stringify(message.toJSON()),
          },
        },
      },
    });

    if (response.data && response.data.createConversationMessage) {
      afterCreate();
      this.setState({ message: Value.fromJSON(initialValue) });
      if (hideCompose) onCancelCompose();
    }
  }

  handleKeyDown(event, editor, next) {
    if (isHotKey('Enter', event)) event.preventDefault();

    if (isHotKey('shift+Enter', event)) return this.handleCreate({ hideCompose: false });
    if (isHotKey('mod+Enter', event)) return this.handleCreate();

    return next();
  }

  isReplyEmpty() {
    const { message } = this.state;
    return !Plain.serialize(message);
  }

  render() {
    const { author, message } = this.state;
    const {
      conversationId,
      createdAt,
      meetingId,
      mode,
      onCancelCompose,
      ...props
    } = this.props;

    if (!author) return null;

    return (
      <Container mode={mode} {...props}>
        <AvatarWithMargin src={author.profilePictureUrl} size={36} mode={mode} />
        <MainContainer>
          <HeaderSection>
            <Details>
              <Author mode={mode}>{author.fullName}</Author>
              {createdAt && <Timestamp fromNow parse="X">{createdAt}</Timestamp>}
            </Details>
            {mode === 'compose' && (
              <ReplyButton
                isDisabled={this.isReplyEmpty()}
                onClick={this.handleCreate}
              >
                Reply
              </ReplyButton>
            )}
          </HeaderSection>
          <Content
            autoFocus={mode === 'compose'}
            readOnly={mode === 'display'}
            onChange={this.handleChangeContent}
            onKeyDown={this.handleKeyDown}
            value={message}
            plugins={discussionTopicReplyPlugins}
          />
        </MainContainer>
      </Container>
    );
  }
}

DiscussionTopicReply.propTypes = {
  author: PropTypes.object,
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  createdAt: PropTypes.number,
  meetingId: PropTypes.string.isRequired,
  messageId: PropTypes.string,
  message: PropTypes.string,
  mode: PropTypes.oneOf(['compose', 'display']),
  afterCreate: PropTypes.func,
  onCancelCompose: PropTypes.func,
};

DiscussionTopicReply.defaultProps = {
  author: null,
  createdAt: null,
  messageId: null,
  message: null,
  mode: 'display',
  onCancelCompose: () => {},
  afterCreate: () => {},
};

export default withApollo(DiscussionTopicReply);
