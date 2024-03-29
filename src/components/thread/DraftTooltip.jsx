import React, { useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useSlate } from 'slate-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import { getLocalUser } from 'utils/auth';
import { DocumentContext, DiscussionContext } from 'utils/contexts';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(
  ({ isOpen, isAuthor, styles, theme: { colors } }) => ({
    position: 'absolute',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.2s',
    top: '-10000px',
    left: '-10000px',

    display: 'flex',
    alignItems: 'center',
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    cursor: isAuthor ? 'pointer' : 'default',
    padding: '15px 25px',
    zIndex: 1000,

    ...styles,
  })
);

const AvatarContainer = styled.div({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '10px',
});

const LockIconContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.grey2,
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  position: 'relative',
  top: '12px',
  marginLeft: '-10px',
}));

const LockIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '8px',
}));

const Message = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey0,
  userSelect: 'none',
}));

const DraftTooltip = ({ discussionId, isOpen, parentRef, mode }) => {
  const tooltipRef = useRef(null);
  const editor = useSlate();
  const { handleShowThread } = useContext(
    mode === 'document' ? DocumentContext : DiscussionContext
  );
  const { userId } = getLocalUser();
  const { loading, error, data } = useQuery(discussionQuery, {
    variables: { discussionId },
  });

  if (loading) return null;
  if (error || !data.discussion) return null;

  const { author } = data.discussion;
  const { id, firstName, profilePictureUrl } = author;
  const isAuthor = id === userId;

  const handleClick = event => {
    event.preventDefault();
    event.stopPropagation();
    if (isAuthor)
      handleShowThread({ threadId: discussionId, sourceEditor: editor });
  };

  const calculateTooltipPosition = () => {
    if (!isOpen || !parentRef.current || !tooltipRef.current) return {};

    const {
      offsetHeight: parentHeight,
      offsetWidth: parentWidth,
      offsetTop: parentOffsetTop,
      offsetLeft: parentOffsetLeft,
    } = parentRef.current;
    const { offsetWidth: tooltipWidth } = tooltipRef.current;

    return {
      top: `${parentOffsetTop + parentHeight}px`,
      left: `${parentOffsetLeft + parentWidth / 2 - tooltipWidth / 2}px`,
    };
  };

  const root = window.document.getElementById('root');
  return ReactDOM.createPortal(
    <Container
      ref={tooltipRef}
      isOpen={isOpen}
      isAuthor={isAuthor}
      onClick={handleClick}
      styles={calculateTooltipPosition()}
    >
      <AvatarContainer>
        <Avatar avatarUrl={profilePictureUrl} size={32} />
        {!isAuthor && (
          <LockIconContainer>
            <LockIcon icon="lock" />
          </LockIconContainer>
        )}
      </AvatarContainer>

      <Message>
        {isAuthor ? 'Continue draft' : `${firstName} is writing a draft`}
      </Message>
    </Container>,
    root
  );
};

DraftTooltip.propTypes = {
  discussionId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(['document', 'discussion']),
};

DraftTooltip.defaultProps = {
  mode: 'document', // for backwards compatibility
};

export default DraftTooltip;
