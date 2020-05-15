/* eslint no-nested-ternary: 0 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useHover from 'hooks/shared/useHover';

import DraftTooltip from './DraftTooltip';
import InlineThreadPreview from './InlineThreadPreview';

const HIDE_PREVIEW_WAIT_INTERVAL = 200;
const SHOW_PREVIEW_WAIT_INTERVAL = 800;

const Highlight = styled.span(
  {
    cursor: 'pointer',
    padding: '2px 0px',
  },
  ({ isHover, isInitialDraft, isResolved, theme: { colors } }) => {
    const getHighlightColor = () => {
      if (isResolved) return colors.grey6;
      if (isInitialDraft) return colors.blue;
      return colors.highlightYellow;
    };

    if (!isHover)
      return {
        borderBottom: `2px solid ${getHighlightColor()}`,
        opacity: 1,
      };

    return {
      background: getHighlightColor(),
      opacity: 0.9,
    };
  }
);

const InlineThreadElement = ({ attributes, children, element }) => {
  const ref = useRef(null);
  const [isHighlightHover, setIsHighlightHover] = useState(false);
  const [isPreviewHover, setIsPreviewHover] = useState(false);
  const { discussionId, isInitialDraft, isResolved, mode } = element;

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

  const Tooltip = isInitialDraft ? DraftTooltip : InlineThreadPreview;

  return (
    <span ref={ref} {...highlightHoverProps}>
      <Highlight
        isHover={isHighlightHover || isPreviewHover}
        isInitialDraft={isInitialDraft}
        isResolved={isResolved}
        {...attributes}
      >
        {children}
      </Highlight>
      {discussionId && (
        <Tooltip
          parentRef={ref}
          discussionId={discussionId}
          isOpen={isPreviewHover}
          mode={mode}
          {...previewHoverProps}
        />
      )}
    </span>
  );
};

InlineThreadElement.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.object.isRequired,
};

export default InlineThreadElement;
