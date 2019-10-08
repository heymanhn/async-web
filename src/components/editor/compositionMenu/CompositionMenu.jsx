import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';

import TextOption from '../plugins/blocks/text';
import { LargeTitleOption, SmallTitleOption } from '../plugins/blocks/headings';
import { BulletedListOption, NumberedListOption, ChecklistOption } from '../plugins/blocks/lists';
import { CodeBlockOption } from '../plugins/blocks/codeBlock';
import { BlockQuoteOption } from '../plugins/blocks/blockQuote';
import { SectionBreakOption } from '../plugins/blocks/sectionBreak';
import { ImageOption } from '../plugins/blocks/image';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '3px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  maxHeight: '260px',
  opacity: 0,
  overflow: 'auto',
  paddingBottom: '15px',
  position: 'absolute',
  top: '-10000px',
  left: '-10000px',
  width: '240px',
  zIndex: 1,
}), ({ coords, isOpen }) => {
  if (!isOpen || !coords) return {};

  const { top, left } = coords;
  return { opacity: 1, top, left };
});

const SectionTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontWeight: 500,
  fontSize: '12px',
  margin: '15px 0 8px 20px',
}));

const CompositionMenu = ({ editor, handleClose, isOpen, query, ...props }) => {
  const menu = useRef();
  const handleClickOutside = () => {
    if (!isOpen) return;
    handleClose();
  };
  useClickOutside({ handleClickOutside, isOpen, ref: menu });

  // In the future, also need to reset the menu
  function handleClick() {
    handleClose();
  }

  function calculateMenuPosition() {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      top: `${rect.top + window.pageYOffset + 30}px`,
      left: `${rect.left + window.pageXOffset}px`,
    };
  }

  return (
    <Container
      coords={calculateMenuPosition()}
      isOpen={isOpen}
      onClick={handleClick}
      ref={menu}
      {...props}
    >
      {/* TODO: Filter these lists down as I type */}
      <SectionTitle>BASIC</SectionTitle>
      <TextOption editor={editor} />
      <LargeTitleOption editor={editor} />
      <SmallTitleOption editor={editor} />

      <SectionTitle>SECTIONS</SectionTitle>
      <BulletedListOption editor={editor} />
      <NumberedListOption editor={editor} />
      <ChecklistOption editor={editor} />
      <CodeBlockOption editor={editor} />
      <BlockQuoteOption editor={editor} />
      <SectionBreakOption editor={editor} />

      <SectionTitle>MEDIA</SectionTitle>
      <ImageOption editor={editor} />
    </Container>
  );
};

CompositionMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  query: PropTypes.string,
};

CompositionMenu.defaultProps = {
  query: '',
};

export default CompositionMenu;
