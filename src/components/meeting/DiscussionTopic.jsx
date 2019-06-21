import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import meetingConversationQuery from 'graphql/meetingConversationQuery';
import createConversationMutation from 'graphql/createConversationMutation';
import { initialValue, discussionTopicPlugins } from 'utils/slateHelper';
import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';
import Button from 'components/shared/Button';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey5}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
  marginBottom: '20px',
  width: '100%',
}));

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  margin: '20px',
});

const AvatarWithMargin = styled(Avatar)({
  marginRight: '12px',
});

const ContentContainer = styled.div({
  width: '100%',
});

const Author = styled.span({
  fontSize: '14px',
  fontWeight: 600,
});

const Content = styled(Editor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '10px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

const ActionsContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  borderRadius: '0 0 5px 5px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: '68px',
  paddingRight: '20px',
  minHeight: '56px',
}));

const SmallButton = styled(Button)({
  marginRight: '10px',
  padding: '5px 20px',
});

const AddReplyButton = styled.div({
  fontSize: '14px',
  fontWeight: 500,
});

/*
 * A discussion topic supports two modes:
 * 1. Display
 * 2. Compose
 *
 * In compose mode, the editor is no longer read-only.
 */
class DiscussionTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: Value.fromJSON(initialValue),
      currentUser: null,
      loading: true,
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  async componentDidMount() {
    const { client, conversationId, meetingId } = this.props;
    const { userId } = getLocalUser();

    if (!conversationId) {
      // Assumes that currentUserQuery is already run once from <AvatarDropdown />
      const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });
      this.setState({ currentUser: user, loading: false });
      return;
    }

    try {
      const response = await client.query({
        query: meetingConversationQuery,
        variables: { meetingId, conversationId },
      });

      if (response.data && response.data.conversation) {
        const { author, createdAt, messages } = response.data.conversation;

        // So that the build will pass. I still need to show this timestamp on the discussion UI
        console.log(createdAt);

        // Assumes each conversation has at least one message
        const { body: { payload } } = messages[0];

        this.setState({
          loading: false,
          currentUser: author,
          content: Value.fromJSON(JSON.parse(payload)),
        });
      }
    } catch (err) {
      console.log('Error loading the conversation');
    }
  }

  handleChangeContent({ value }) {
    this.setState({ content: value });
  }

  async handleCreate() {
    const { content } = this.state;
    const { client, meetingId: id, onCancelCompose, onCreate } = this.props;

    try {
      const response = await client.mutate({
        mutation: createConversationMutation,
        variables: {
          id,
          input: {
            messages: [{
              body: {
                formatter: 'slatejs',
                text: Plain.serialize(content),
                payload: JSON.stringify(content.toJSON()),
              },
            }],
          },
        },
      });

      if (response.data && response.data.createConversation) {
        this.setState({ content: Value.fromJSON(initialValue) });
        onCreate();
        onCancelCompose();
      }
    } catch (err) {
      // No error handling yet
      console.log('error creating conversation topic');
    }
  }

  render() {
    const { currentUser, content, loading } = this.state;
    const { onCancelCompose, mode } = this.props;
    if (loading) return null;

    const composeBtns = (
      <React.Fragment>
        <SmallButton title="Add Topic" onClick={this.handleCreate} />
        <SmallButton type="light" title="Cancel" onClick={onCancelCompose} />
      </React.Fragment>
    );

    return (
      <Container>
        <MainContainer>
          <AvatarWithMargin src={currentUser.profilePictureUrl} size={36} />
          <ContentContainer>
            <div>
              <Author>{currentUser.fullName}</Author>
              {/* TODO: Put the timestamp here */}
            </div>
            <Content
              autoFocus
              onChange={this.handleChangeContent}
              value={content}
              plugins={discussionTopicPlugins}
            />
          </ContentContainer>
        </MainContainer>
        <ActionsContainer>
          {mode === 'compose' ? composeBtns : <AddReplyButton>&#43; Add a reply</AddReplyButton>}
        </ActionsContainer>
      </Container>
    );
  }
}

DiscussionTopic.propTypes = {
  client: PropTypes.object.isRequired,
  conversationId: PropTypes.string,
  meetingId: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['compose', 'display']),
  onCreate: PropTypes.func,
  onCancelCompose: PropTypes.func,
};

DiscussionTopic.defaultProps = {
  conversationId: null,
  mode: 'display',
  onCancelCompose: () => {},
  onCreate: () => { },
};

export default withApollo(DiscussionTopic);
