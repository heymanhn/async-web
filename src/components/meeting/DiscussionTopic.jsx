import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
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
  marginBottom: '30px',
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

  componentDidMount() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    // Assumes that currentUserQuery is already run once from <AvatarDropdown />
    const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });

    // TODO: show existing discussion topics

    this.setState({ currentUser: user, loading: false });
  }

  handleChangeContent({ value }) {
    this.setState({ content: value });
  }

  async handleCreate() {
    const { content } = this.state;
    const { client, meetingId: id, onCancelCompose } = this.props;
    const contentJSON = JSON.stringify(content.toJSON());

    try {
      const response = await client.mutate({
        mutation: createConversationMutation,
        variables: {
          id,
          input: {
            messages: [{
              body: {
                formatter: 'slatejs',
                payload: contentJSON,
              },
            }],
          },
        },
      });

      if (response.data && response.data.createConversation) {
        this.setState({ content: Value.fromJSON(initialValue) });
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
  onCancelCompose: PropTypes.func.isRequired,
};

DiscussionTopic.defaultProps = {
  conversationId: null,
  mode: 'display',
};

export default withApollo(DiscussionTopic);
