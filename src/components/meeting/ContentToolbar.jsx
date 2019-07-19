// HN: Future me, please find a way to DRY this up with <EditorActions />
import React from 'react';
import PropTypes from 'prop-types';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled/macro';

import AddReactionButton from './AddReactionButton';

const heights = {
  topic: '52px',
  modalTopic: '52px',
  modalReply: '32px',
};

const layouts = {
  topic: ({ colors }) => ({
    borderRadius: '0 0 5px 5px',
    borderTop: `1px solid ${colors.borderGrey}`,
    minHeight: heights.topic,
  }),
  modalTopic: ({ colors }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    minHeight: heights.modalTopic,
  }),
  modalReply: () => ({
    background: 'none',
    minHeight: heights.modalReply,
    marginTop: '10px',
  }),
};

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  color: colors.grey3,

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}), ({ contentType, theme: { colors } }) => layouts[contentType]({ colors }));

// Only for modal reply UIs
const InnerContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  minHeight: heights.modalReply,
}));

const ButtonContainer = styled.div(({ contentType }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: contentType === 'modalReply' ? 'center' : 'initial',
  margin: contentType === 'modalReply' ? '0px 15px' : '0px 30px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ contenttype, theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: contenttype === 'modalReply' ? '16px' : '22px',
  marginRight: '10px',
}));

const CountLabel = styled.div(({ contentType }) => ({
  fontSize: contentType === 'modalReply' ? '13px' : '14px',
  fontWeight: 500,
}));

const VerticalDivider = styled.div(({ contentType, theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: heights[contentType],
  margin: 0,
}));

const StyledAddReactionButton = styled(AddReactionButton)({
  marginLeft: '15px',
});

const ContentToolbar = ({ contentType, replyCount }) => {
  // Doing this for now. will make more complex later when reactions UX is added
  if (!replyCount && contentType === 'modalReply') return null;

  const countLabel = replyCount || (contentType === 'topic' ? 'add a reply' : 0);
  const repliesButton = (
    <React.Fragment>
      <ButtonContainer contentType={contentType}>
        <StyledIcon contenttype={contentType} icon={faComment} />
        <CountLabel contentType={contentType}>{countLabel}</CountLabel>
      </ButtonContainer>
      {/* Temporary contentType flag below */}
      {contentType !== 'modalReply' && <VerticalDivider contentType={contentType} />}
      {contentType !== 'modalReply' && <StyledAddReactionButton size="large" />}
    </React.Fragment>
  );

  if (contentType === 'modalReply') {
    return (
      <Container contentType={contentType}>
        <InnerContainer>
          {repliesButton}
        </InnerContainer>
      </Container>
    );
  }

  return (
    <Container contentType={contentType}>
      {repliesButton}
    </Container>
  );
};

ContentToolbar.propTypes = {
  contentType: PropTypes.oneOf(['topic', 'modalTopic', 'modalReply']).isRequired,
  replyCount: PropTypes.number.isRequired,
};

export default ContentToolbar;
