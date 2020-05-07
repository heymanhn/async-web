import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Range } from 'slate';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useModalDimensions from 'hooks/thread/useModalDimensions';
import useSelectionDimensions from 'hooks/editor/useSelectionDimensions';

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
  const toolbarRef = useRef(null);
  const editor = useSlate();
  const { selection } = editor;

  const isOpen = selection && Range.isExpanded(selection);
  const { coords, rect } = useSelectionDimensions({ skip: !isOpen });
  const { getModalCoords } = useModalDimensions(toolbarRef);

  // Figure out where the toolbar should be displayed based on the user's
  // text selection
  const adjustedCoords = () => {
    const { current: toolbar } = toolbarRef;
    if (!isOpen || !toolbar || !coords) return {};

    const { top, left } = coords;
    const { offsetWidth: toolbarWidth } = toolbar;
    const { width: selectionWidth } = rect;

    // Default: center-align the toolbar to the current selection
    const centeredLeft = left - toolbarWidth / 2 + selectionWidth / 2;
    const newTop = top - toolbar.offsetHeight;

    // Adjust the dimensions if needed, if the UI is in a modal
    return getModalCoords({ top: newTop, left: centeredLeft });
  };

  return (
    <Container ref={toolbarRef} styles={adjustedCoords()} isOpen={isOpen}>
      {children}
    </Container>
  );
};

Toolbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Toolbar;
