import React from 'react';
import PropTypes from 'prop-types';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled/macro';

// HN: DRY this up with EditorActions in the future
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
  // modalTopic: styled.div({ }),
  // modalReply: styled.div({

  // }),
};

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  color: colors.grey3,

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}), ({ contentType, theme: { colors } }) => layouts[contentType]({ colors }));

const ButtonContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  margin: '0px 30px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '22px',
  marginRight: '10px',
}));

const CountLabel = styled.div({
  fontSize: '14px',
  fontWeight: 500,
});

const VerticalDivider = styled.div(({ contentType, theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: heights[contentType],
  margin: 0,
}));

const ContentToolbar = ({ contentType, replyCount }) => {
  const repliesButton = (
    <React.Fragment>
      <ButtonContainer>
        <StyledIcon icon={faComment} />
        <CountLabel>{replyCount || 'add a reply'}</CountLabel>
      </ButtonContainer>
      <VerticalDivider contentType={contentType} />
    </React.Fragment>
  );

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
