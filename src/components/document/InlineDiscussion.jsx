import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const HOVER_GRACE_PERIOD = 200;

const Container = styled.span({
});

const Highlight = styled.span(({ theme: { colors } }) => ({
  background: colors.highlightYellow,
  cursor: 'pointer',
  padding: '2px 0px',
}));

const Preview = styled.div(({ isOpen, theme: { colors, documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  cursor: 'default',
  height: '60px',
  margin: '-2px -30px 0',
  opacity: isOpen ? 1 : 0,
  padding: '0 25px',
  transition: 'opacity 0.2s',
  width: documentViewport,
  zIndex: isOpen ? 1 : -1,
}));

const InlineDiscussion = ({ attributes, children, handleClick }) => {
  const [isHighlightHover, setIsHighlightHover] = useState(false);
  const [isPreviewHover, setIsPreviewHover] = useState(false);

  // See https://upmostly.com/tutorials/settimeout-in-react-components-using-hooks
  const isPreviewHoverRef = useRef(isPreviewHover);
  isPreviewHoverRef.current = isPreviewHover;

  function handleHighlightHoverOn() {
    setIsHighlightHover(true);
    setIsPreviewHover(true);
  }
  function handleHighlightHoverOff() {
    setIsPreviewHover(false);
    setTimeout(() => {
      if (!isPreviewHoverRef.current) setIsHighlightHover(false);
    }, HOVER_GRACE_PERIOD);
  }
  function handlePreviewHoverOn() {
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
      onClick={handleClick}
    >
      <Highlight
        {...attributes}
      >
        {children}
      </Highlight>
      <Preview
        isOpen={isHighlightHover || isPreviewHover}
        onBlur={handlePreviewHoverOff}
        onFocus={handlePreviewHoverOn}
        onMouseOut={handlePreviewHoverOff}
        onMouseOver={handlePreviewHoverOn}
        onClick={handleClick}
      >
        Hello testing testing
      </Preview>
    </Container>
  );
};

InlineDiscussion.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default InlineDiscussion;
