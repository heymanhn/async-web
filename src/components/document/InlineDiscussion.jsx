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

const Preview = styled.div(({ theme: { colors, documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'default',
  height: '60px',
  margin: '-2px -30px 0',
  padding: '0 25px',
  width: documentViewport,
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
      {(isHighlightHover || isPreviewHover) && (
        <Preview
          onBlur={handlePreviewHoverOff}
          onFocus={handlePreviewHoverOn}
          onMouseOut={handlePreviewHoverOff}
          onMouseOver={handlePreviewHoverOn}
          onClick={handleClick}
        >
          Hello testing testing
        </Preview>
      )}
    </Container>
  );
};

InlineDiscussion.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default InlineDiscussion;
