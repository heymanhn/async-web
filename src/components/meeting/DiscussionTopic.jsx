import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import styled from '@emotion/styled';

import currentUserQuery from 'graphql/currentUserQuery';
import { initialValue, discussionTopicPlugins } from 'utils/slateHelper';
import { getLocalUser } from 'utils/auth';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.grey5}`,
  borderRadius: '5px',
  boxShadow: `0px 1px 3px ${colors.buttonGrey}`,
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

const AddReplyButton = styled.div({
  fontSize: '14px',
  fontWeight: 500,
});

class DiscussionTopic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      currentUser: null,
      content: null,
    };

    this.handleChangeContent = this.handleChangeContent.bind(this);
  }

  componentDidMount() {
    const { client } = this.props;
    const { userId } = getLocalUser();

    // Assumes that currentUserQuery is already run once from <AvatarDropdown />
    const { user } = client.readQuery({ query: currentUserQuery, variables: { id: userId } });

    // TODO: show existing discussion topics

    this.setState({ currentUser: user, content: Value.fromJSON(initialValue), loading: false });
  }

  handleChangeContent({ value }) {
    this.setState({ content: value });
  }

  render() {
    const { currentUser, content, loading } = this.state;
    if (loading) return null;

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
              onChange={this.handleChangeContent}
              value={content}
              plugins={discussionTopicPlugins}
            />
          </ContentContainer>
        </MainContainer>
        <ActionsContainer>
          <AddReplyButton>&#43; Add a reply</AddReplyButton>
        </ActionsContainer>
      </Container>
    );
  }
}

DiscussionTopic.propTypes = {
  client: PropTypes.object.isRequired,
};

export default withApollo(DiscussionTopic);
