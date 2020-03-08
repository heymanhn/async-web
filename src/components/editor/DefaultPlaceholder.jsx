import React from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useSelectionDimensions from 'utils/hooks/useSelectionDimensions';

import ContentPlaceholder from 'components/editor/ContentPlaceholder';
import Editor from 'components/editor/Editor';

const Container = styled.div(({ styles }) => ({
  position: 'absolute',
  cursor: 'text',
  userSelect: 'none',
  ...styles,
}));

const DefaultPlaceholder = () => {
  const editor = useSlate();
  const isFocused = ReactEditor.isFocused(editor);
  const isEmpty = Editor.isEmptyContent(editor);
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
      top: `${top + 1}px`, // match height of composition menu placeholder
      left: `${left + 2}px`, // match width of composition menu placeholder
    };
  };

  return (
    <Container onClick={handleClick} styles={adjustedCoords()}>
      <ContentPlaceholder />
    </Container>
  );
};

export default DefaultPlaceholder;
