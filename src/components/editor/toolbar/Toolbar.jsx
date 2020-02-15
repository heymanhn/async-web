import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Range } from 'slate';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

const Container = styled.div(
  ({ theme: { colors } }) => ({
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
    marginTop: '-6px',
    opacity: 0,
    padding: '0px 5px',
    position: 'absolute',
    transition: 'opacity 0.3s',
    zIndex: 10000,
  }),
  ({ coords, isOpen }) => {
    if (!isOpen) return {};

    const { top, left } = coords;
    return { opacity: isOpen ? 1 : 0, top, left };
  }
);

const Toolbar = ({ children }) => {
  const ref = useRef(null);
  const editor = useSlate();
  const { selection } = editor;

  const isOpen = selection && Range.isExpanded(selection);
  const root = window.document.getElementById('root');

  // Figure out where the toolbar should be displayed based on the user's text selection
  function calculateToolbarPosition() {
    if (!isOpen || !ref.current) return {};

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      top: `${rect.top + window.pageYOffset - ref.current.offsetHeight}px`,
      left: `${rect.left +
        window.pageXOffset -
        ref.current.offsetWidth / 2 +
        rect.width / 2}px`,
    };
  }

  return ReactDOM.createPortal(
    <Container ref={ref} coords={calculateToolbarPosition()} isOpen={isOpen}>
      {children}
    </Container>,
    root
  );
};

Toolbar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Toolbar;
