import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Range } from 'slate';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useSelectionDimensions from 'hooks/editor/useSelectionDimensions';
import { ThreadContext } from 'utils/contexts';

// Number of pixels padding from left/right edge of the modal, if needed
const EDGE_PADDING = 20;

const Container = styled.div(({ isOpen, styles, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  top: '-10000px',
  left: '-10000px',

  background: colors.mainText,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
  fontSize: '16px',
  height: '40px',
  marginTop: '0px',
  opacity: isOpen ? 1 : 0,
  padding: '0px 5px',
  position: 'absolute',
  transition: 'opacity 0.3s',
  zIndex: 10000,

  ...styles,
}));

const Toolbar = ({ children }) => {
  const ref = useRef(null);
  const editor = useSlate();
  const { selection } = editor;
  const { modalRef } = useContext(ThreadContext);

  const isOpen = selection && Range.isExpanded(selection);
  const { coords, rect } = useSelectionDimensions({ skip: !isOpen });

  const adjustedLeft = left => {
    const { current: toolbar } = ref;
    const { offsetWidth: toolbarWidth } = toolbar;
    const { width: selectionWidth } = rect;
    const { current: modal } = modalRef || {};

    // # pixels from left edge of viewport, if this toolbar is center-aligned
    const newLeft = left - toolbarWidth / 2 + selectionWidth / 2;

    // The toolbar can always be center aligned when not in the modal
    if (!modal) return newLeft;

    // Otherwise, left or right align as appropriate, as long as the
    // whole toolbar is visible in the modal
    const { offsetWidth } = modal;
    const leftEdge = EDGE_PADDING;
    if (newLeft < leftEdge) return leftEdge;

    const rightEdge = offsetWidth - EDGE_PADDING;
    const newRight = newLeft + toolbarWidth;
    if (newRight > rightEdge) return rightEdge - toolbarWidth;

    return newLeft;
  };

  // Figure out where the toolbar should be displayed based on the user's
  // text selection
  const adjustedCoords = () => {
    const { current: toolbar } = ref;
    if (!isOpen || !toolbar || !coords) return {};

    const { top, left } = coords;
    const newLeft = adjustedLeft(left);

    return {
      top: `${top - toolbar.offsetHeight}px`,
      left: newLeft,
    };
  };

  return (
    <Container ref={ref} styles={adjustedCoords()} isOpen={isOpen}>
      {children}
    </Container>
  );
};

Toolbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Toolbar;
