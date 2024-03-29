import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useSelectionDimensions from 'hooks/editor/useSelectionDimensions';

import ContentPlaceholder from 'components/editor/ContentPlaceholder';
import Editor from 'components/editor/Editor';

const Container = styled.div(({ styles, theme: { fontProps } }) => ({
  ...fontProps({ size: 16 }),
  position: 'absolute',
  cursor: 'text',
  userSelect: 'none',
  ...styles,
}));

const DefaultPlaceholder = props => {
  const editor = useSlate();
  const { children } = editor;
  const isFocused = ReactEditor.isFocused(editor);
  const isEmpty = children.length === 1 && Editor.isEmpty(editor, children[0]);
  const hidePlaceholder = isFocused || !isEmpty;

  const { coords } = useSelectionDimensions({
    skip: hidePlaceholder,
    source: 'notFocused',
  });

  if (hidePlaceholder) return null;

  const handleClick = event => {
    event.preventDefault();
    ReactEditor.focus(editor);
  };

  const adjustedCoords = () => {
    if (hidePlaceholder || !coords) return null;

    const { top, left } = coords;
    return {
      top: `${top}px`,
      left: `${left + 2}px`, // match width of composition menu placeholder
    };
  };

  return (
    <Container onClick={handleClick} styles={adjustedCoords()} {...props}>
      <ContentPlaceholder />
    </Container>
  );
};

export default DefaultPlaceholder;
