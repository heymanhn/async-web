/* eslint no-nested-ternary: 0 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import useHover from 'utils/hooks/useHover';

import InlineDiscussionPreview from './InlineDiscussionPreview';

const HIDE_PREVIEW_WAIT_INTERVAL = 200;
const SHOW_PREVIEW_WAIT_INTERVAL = 800;

const Highlight = styled.span(
  {
    cursor: 'pointer',
    padding: '2px 0px',
  },
  ({ isHover, isInitialDraft, theme: { colors } }) => {
    if (!isHover)
      return {
        borderBottom: `2px solid ${
          isInitialDraft ? colors.blue : colors.highlightYellow
        }`,
        opacity: 1,
      };

    return {
      background: isInitialDraft ? colors.blue : colors.highlightYellow,
      opacity: 0.9,
    };
  }
);

const InlineDiscussionElement = ({ attributes, children, element }) => {
  const ref = useRef(null);
  const [isHighlightHover, setIsHighlightHover] = useState(false);
  const [isPreviewHover, setIsPreviewHover] = useState(false);
  const { discussionId, isInitialDraft, authorId } = element;

  // See https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isHighlightHoverRef = useRef(isHighlightHover);
  isHighlightHoverRef.current = isHighlightHover;

  const handleHighlightHoverOn = () => {
    setIsHighlightHover(true);
    setTimeout(() => {
      if (isHighlightHoverRef.current) setIsPreviewHover(true);
    }, SHOW_PREVIEW_WAIT_INTERVAL);
  };

  const handleHighlightHoverOff = () => {
    setIsHighlightHover(false);
    setTimeout(() => {
      if (!isHighlightHoverRef.current) setIsPreviewHover(false);
    }, HIDE_PREVIEW_WAIT_INTERVAL);
  };

  const highlightHoverProps = useHover(
    true,
    handleHighlightHoverOn,
    handleHighlightHoverOff
  );
  delete highlightHoverProps.hover;

  const handlePreviewHoverOn = () => {
    setIsHighlightHover(true);
    setIsPreviewHover(true);
  };

  const handlePreviewHoverOff = () => {
    setIsPreviewHover(false);
    setIsHighlightHover(false);
  };

  const previewHoverProps = useHover(
    true,
    handlePreviewHoverOn,
    handlePreviewHoverOff
  );
  delete previewHoverProps.hover;

  const { userId } = getLocalUser();
  const isAuthor = userId === authorId;
  if (isInitialDraft && !isAuthor) {
    return <span>{children}</span>;
  }

  return (
    <span ref={ref} {...highlightHoverProps}>
      <Highlight
        isHover={isHighlightHover || isPreviewHover}
        isInitialDraft={isInitialDraft}
        {...attributes}
      >
        {children}
      </Highlight>
      {discussionId && (
        <InlineDiscussionPreview
          parentRef={ref}
          discussionId={discussionId}
          isOpen={isPreviewHover}
          {...previewHoverProps}
        />
      )}
    </span>
  );
};

InlineDiscussionElement.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.object.isRequired,
};

export default InlineDiscussionElement;
