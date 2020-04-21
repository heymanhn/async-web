/*
 * This toolbar component is only for DOM text selections where Slate
 * is not activated.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { SHOW_TOOLBAR_DELAY } from 'utils/constants';
import useSelectionDimensions from 'utils/hooks/useSelectionDimensions';

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

const DOMToolbar = ({ children }) => {
  const ref = useRef(null);
  const selection = window.getSelection();
  const [isOpen, setIsOpen] = useState(selection && !selection.isCollapsed);
  const { coords, rect } = useSelectionDimensions({
    source: 'DOMSelection',
  });

  const handleSelectionChange = useCallback(() => {
    const isExpanded = !window.getSelection().isCollapsed;
    if (isOpen !== isExpanded) {
      const updateIsOpen = () => setIsOpen(isExpanded);

      // Better visuals: let selection be stabilized before showing the toolbar
      const interval = isOpen ? 0 : SHOW_TOOLBAR_DELAY;
      setTimeout(updateIsOpen, interval);
    }
  }, [isOpen]);

  useEffect(() => {
    window.document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      window.document.removeEventListener(
        'selectionchange',
        handleSelectionChange
      );
    };
  }, [handleSelectionChange]);

  // Figure out where the toolbar should be displayed based on the user's
  // text selection
  const adjustedCoords = () => {
    const { current: toolbarRef } = ref;
    if (!isOpen || !toolbarRef || !coords) return {};

    const { top, left } = coords;
    return {
      top: `${top - toolbarRef.offsetHeight}px`,

      // Horizontally center align the toolbar against the selection range
      left: `${left - toolbarRef.offsetWidth / 2 + rect.width / 2}px`,
    };
  };

  return (
    <Container ref={ref} styles={adjustedCoords()} isOpen={isOpen}>
      {children}
    </Container>
  );
};

DOMToolbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DOMToolbar;
