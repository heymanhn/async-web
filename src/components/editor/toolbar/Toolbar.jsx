import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { BoldButton } from '../plugins/marks/bold';
import { ItalicButton } from '../plugins/marks/italic';
import { LargeFontButton, MediumFontButton } from '../plugins/blocks/headings';
import { BulletedListButton } from '../plugins/blocks/lists';
import { BlockQuoteButton } from '../plugins/blocks/blockQuote';
import { CodeBlockButton } from '../plugins/blocks/codeBlock';
import { StartDiscussionButton } from '../plugins/inlineDiscussion';

const Container = styled.div(({ theme: { colors } }) => ({
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
}), ({ coords, isOpen }) => {
  if (!isOpen) return {};

  const { top, left } = coords;
  return { opacity: isOpen ? 1 : 0, top, left };
});

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.grey1}`,
  height: '24px',
  margin: '0 5px',
}));

const Toolbar = ({ editor, isOpen }) => {
  const ref = useRef(null);

  const root = window.document.getElementById('root');

  // Figure out where the toolbar should be displayed based on the user's text selection
  function calculateToolbarPosition() {
    if (!isOpen || !ref.current) return {};

    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      top: `${rect.top + window.pageYOffset - ref.current.offsetHeight}px`,
      left: `${rect.left + window.pageXOffset - ref.current.offsetWidth / 2 + rect.width / 2}px`,
    };
  }

  return ReactDOM.createPortal(
    <Container ref={ref} coords={calculateToolbarPosition()} isOpen={isOpen}>
      <BoldButton editor={editor} />
      <ItalicButton editor={editor} />
      <VerticalDivider />

      <LargeFontButton editor={editor} />
      <MediumFontButton editor={editor} />
      <BulletedListButton editor={editor} />
      <VerticalDivider />

      <BlockQuoteButton editor={editor} />
      <CodeBlockButton editor={editor} />
      <VerticalDivider />

      <StartDiscussionButton editor={editor} />
    </Container>,
    root,
  );
};

Toolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default Toolbar;
