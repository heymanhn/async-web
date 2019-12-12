import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import InlineDiscussionPreview from './InlineDiscussionPreview';

const HIDE_PREVIEW_WAIT_INTERVAL = 200;
const SHOW_PREVIEW_WAIT_INTERVAL = 800;

const Container = styled.span({ });

const Highlight = styled.span(({ isHover, theme: { colors } }) => ({
  background: isHover ? colors.highlightYellow : 'none',
  borderBottom: isHover ? 'none' : `2px solid ${colors.highlightYellow}`,
  cursor: 'pointer',
  opacity: isHover ? 0.9 : 1,
  padding: '2px 0px',
}));

const InlineDiscussion = ({
  attributes,
  children,
  discussionId,
  handleClick,
  handleShowDiscussion,
}) => {
  const [isHighlightHover, setIsHighlightHover] = useState(false);
  const [isPreviewHover, setIsPreviewHover] = useState(false);

  // See https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isHighlightHoverRef = useRef(isHighlightHover);
  isHighlightHoverRef.current = isHighlightHover;

  function handleHighlightHoverOn() {
    setIsHighlightHover(true);
    setTimeout(() => {
      if (isHighlightHoverRef.current) setIsPreviewHover(true);
    }, SHOW_PREVIEW_WAIT_INTERVAL);
  }

  function handleHighlightHoverOff() {
    setIsHighlightHover(false);
    setTimeout(() => {
      if (!isHighlightHoverRef.current) setIsPreviewHover(false);
    }, HIDE_PREVIEW_WAIT_INTERVAL);
  }

  function handlePreviewHoverOn() {
    setIsHighlightHover(true);
    setIsPreviewHover(true);
  }

  function handlePreviewHoverOff() {
    setIsPreviewHover(false);
    setIsHighlightHover(false);
  }

  return (
    <Container
      onBlur={handleHighlightHoverOff}
      onFocus={handleHighlightHoverOn}
      onMouseOut={handleHighlightHoverOff}
      onMouseOver={handleHighlightHoverOn}
    >
      <Highlight
        isHover={isHighlightHover || isPreviewHover}
        onClick={handleClick}
        {...attributes}
      >
        {children}
      </Highlight>
      {discussionId && isPreviewHover ? (
        <InlineDiscussionPreview
          discussionId={discussionId}
          handleShowDiscussion={handleShowDiscussion}
          isOpen={isPreviewHover}
          onBlur={handlePreviewHoverOff}
          onFocus={handlePreviewHoverOn}
          onMouseOut={handlePreviewHoverOff}
          onMouseOver={handlePreviewHoverOn}
        />
      ) : undefined }

    </Container>
  );
};

InlineDiscussion.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  discussionId: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleShowDiscussion: PropTypes.func.isRequired,
};

export default InlineDiscussion;
