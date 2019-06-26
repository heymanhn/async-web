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
import updateConversationMessageMutation from 'graphql/updateConversationMessageMutation';
import { initialValue, discussionTopicReplyPlugins } from 'utils/slateHelper';
import { getLocalUser } from 'utils/auth';
import withHover from 'utils/withHover';

import Avatar from 'components/shared/Avatar';
import EditorActions from './EditorActions';

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
  alignItems: 'baseline',
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

const Content = styled(Editor)({
  fontSize: '14px',
  lineHeight: '22px',
  fontWeight: 400,
  marginTop: '10px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

const EditButtonSeparator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  margin: '0 10px',
}));

const EditButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',

  ':hover': {
    textDecoration: 'underline',
  },
}));

class DiscussionTopicReply extends Component {
  constructor(props) {
    super(props);

    const initialJSON = props.message ? JSON.parse(props.message) : initialValue;

    this.state = {
      author: props.author || null,
      message: Value.fromJSON(initialJSON),
      mode: props.mode,
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.handleCancelCompose = this.handleCancelCompose.bind(this);
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

  async handleSubmit({ hideCompose = true } = {}) {
    const { message, mode } = this.state;
    if (this.isReplyEmpty()) return;

    const mutation = mode === 'compose'
      ? createConversationMessageMutation : updateConversationMessageMutation;
    const {
      client,
      conversationId,
      meetingId,
      messageId,
      onCancelCompose,
      afterSubmit,
    } = this.props;

    const response = await client.mutate({
      mutation,
      variables: {
        id: conversationId,
        mid: messageId,
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

    if (response.data) {
      afterSubmit();
      this.setState({ message: Value.fromJSON(initialValue) });
      if (hideCompose) onCancelCompose();
      if (mode === 'update') this.handleCancelEditMode();
    }
  }

  handleKeyDown(event, editor, next) {
    const { mode } = this.state;
    if (isHotKey('Enter', event)) event.preventDefault();

    if (mode !== 'edit' && isHotKey('shift+Enter', event)) {
      return this.handleSubmit({ hideCompose: false });
    }

    if (isHotKey('mod+Enter', event)) return this.handleSubmit();

    return next();
  }

  toggleEditMode() {
    this.setState(prevState => ({ mode: prevState.mode === 'edit' ? 'display' : 'edit' }));
  }

  handleCancelCompose() {
    const { message, onCancelCompose } = this.props;
    const { mode } = this.state;
    if (mode === 'edit') {
      this.setState({ mode: 'display', message: Value.fromJSON(JSON.parse(message)) });
    } else {
      onCancelCompose();
    }
  }

  isReplyEmpty() {
    const { message } = this.state;
    return !Plain.serialize(message);
  }

  render() {
    const { author, message, mode } = this.state;
    const {
      conversationId,
      createdAt,
      hover,
      meetingId,
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
              {hover && mode === 'display' && (
                <React.Fragment>
                  <EditButtonSeparator>&#8226;</EditButtonSeparator>
                  <EditButton onClick={this.handleEnterEditMode}>Edit</EditButton>
                </React.Fragment>
              )}
            </Details>
          </HeaderSection>
          <Content
            autoFocus={mode === 'compose' || mode === 'edit'}
            readOnly={mode === 'display'}
            onChange={this.handleChangeContent}
            onKeyDown={this.handleKeyDown}
            value={message}
            plugins={discussionTopicReplyPlugins}
          />
          {(mode === 'compose' || mode === 'edit') && (
            <EditorActions
              isSubmitDisabled={this.isReplyEmpty()}
              mode={mode}
              onCancel={this.handleCancelCompose}
              onSubmit={this.handleSubmit}
            />
          )}
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
  hover: PropTypes.bool.isRequired,
  meetingId: PropTypes.string.isRequired,
  messageId: PropTypes.string,
  message: PropTypes.string,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']),
  afterSubmit: PropTypes.func,
  onCancelCompose: PropTypes.func,
};

DiscussionTopicReply.defaultProps = {
  author: null,
  createdAt: null,
  messageId: null,
  message: null,
  mode: 'display',
  onCancelCompose: () => {},
  afterSubmit: () => {},
};

export default withHover(withApollo(DiscussionTopicReply));
