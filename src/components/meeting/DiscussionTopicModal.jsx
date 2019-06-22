import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Moment from 'react-moment';
import { Modal } from 'reactstrap';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';
import menuIcon from 'images/icons/menu.png';

const StyledModal = styled(Modal)(({ theme: { maxModalViewport } }) => ({
  margin: '100px auto',
  width: maxModalViewport,
  maxWidth: maxModalViewport,

  '.modal-content': {
    border: 'none',
  },
}));

const TopicSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  margin: '25px 30px 30px',
});

const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AuthorSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const AvatarWithMargin = styled(Avatar)(({ mode }) => ({
  marginRight: '12px',
  opacity: mode === 'compose' ? 0.5 : 1,
}));

const Details = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Author = styled.span({
  fontWeight: 600,
  fontSize: '18px',
});

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
  fontSize: '14px',
}));

const StyledImg = styled.img({
  width: '26px',
  height: 'auto',
});

const Content = styled(Editor)({
  fontSize: '16px',
  lineHeight: '25px',
  fontWeight: 400,
  marginTop: '20px',

  'div:not(:first-of-type)': {
    marginTop: '1em',
  },
});

const RepliesSection = styled.div({});

const ActionsContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',

  borderTop: `1px solid ${colors.borderGrey}`,
  minHeight: '60px',
  padding: '0 30px',
}));

// HN: DRY up these reply button styles later
const AddReplyButton = styled.div(({ theme: { colors } }) => ({
  alignSelf: 'center',
  color: colors.grey3,
  cursor: 'pointer',
  position: 'relative',
  top: '-2px',
}));

const PlusSign = styled.span(({ theme: { colors } }) => ({
  fontSize: '20px',
  fontWeight: 400,
  paddingRight: '5px',
  position: 'relative',
  top: '1px',

  ':hover': {
    color: colors.grey2,
  },
}));

const ButtonText = styled.span(({ theme: { colors } }) => ({
  fontSize: '14px',
  fontWeight: 500,

  ':hover': {
    color: colors.grey2,
    textDecoration: 'underline',
  },
}));

class DiscussionTopicModal extends Component {
  constructor(props) {
    super(props);

    this.state = { isComposingReply: false };

    this.toggleComposeMode = this.toggleComposeMode.bind(this);
  }

  toggleComposeMode() {
    this.setState(prevState => ({ isComposingReply: !prevState.isComposingReply }));
  }

  render() {
    const { isComposingReply } = this.state;
    const {
      author,
      conversationId,
      createdAt,
      meetingId,
      messages,
      ...props
    } = this.props;

    const addReplyButton = (
      <AddReplyButton onClick={this.toggleComposeMode}>
        <PlusSign>+</PlusSign>
        <ButtonText>ADD A REPLY</ButtonText>
      </AddReplyButton>
    );

    return (
      <StyledModal
        fade={false}
        {...props}
      >
        <TopicSection>
          <Header>
            <AuthorSection>
              <AvatarWithMargin src={author.profilePictureUrl} size={45} />
              <Details>
                <Author>{author.fullName}</Author>
                <Timestamp fromNow parse="X">{createdAt}</Timestamp>
              </Details>
            </AuthorSection>
            <StyledImg alt="Menu" src={menuIcon} />
          </Header>
          <Content
            readOnly
            value={Value.fromJSON(JSON.parse(messages[0].body.payload))}
          />
        </TopicSection>
        <RepliesSection>
          Replies
        </RepliesSection>
        <ActionsContainer>
          {!isComposingReply && addReplyButton}
        </ActionsContainer>
      </StyledModal>
    );
  }
}

DiscussionTopicModal.propTypes = {
  author: PropTypes.object.isRequired,
  conversationId: PropTypes.string.isRequired,
  createdAt: PropTypes.number.isRequired,
  meetingId: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
};

export default DiscussionTopicModal;
