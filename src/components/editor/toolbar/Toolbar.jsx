import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import BlockButton from './BlockButton';
import MarkButton from './MarkButton';

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
  zIndex: 1,
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

const Toolbar = React.forwardRef(({ coords, editor, isOpen }, ref) => {
  const root = window.document.getElementById('root');

  return ReactDOM.createPortal(
    <Container ref={ref} coords={coords} isOpen={isOpen}>
      <MarkButton editor={editor} type="bold" />
      <MarkButton editor={editor} type="italic" />
      <VerticalDivider />

      <BlockButton editor={editor} type="heading-one" />
      <BlockButton editor={editor} type="heading-two" />
      <BlockButton editor={editor} type="bulleted-list" />
      <VerticalDivider />

      <BlockButton editor={editor} type="block-quote" />
      <BlockButton editor={editor} type="code-block" />
    </Container>,
    root,
  );
});

Toolbar.propTypes = {
  coords: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
};

Toolbar.defaultProps = { isOpen: false };

export default Toolbar;
