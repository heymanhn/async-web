import React from 'react';
import styled from '@emotion/styled';

import { RenderEditor } from './helpers';

function CustomBodyPlaceholder({ placeholder, when, Component } = {}) {
  const PlaceholderComponent = styled(Component)(({ theme: { colors } }) => ({
    color: colors.textPlaceholder,
    cursor: 'text',
    marginTop: '8px',
    position: 'absolute',
    pointerEvents: 'none',
  }));

  function displayPlaceholder(_props, editor, next) {
    const children = next();

    if (!editor.query(when)) return children;

    return (
      <>
        {children}
        <PlaceholderComponent contentEditable={false}>
          {placeholder}
        </PlaceholderComponent>
      </>
    );
  }

  return RenderEditor(displayPlaceholder);
}

export default CustomBodyPlaceholder;
