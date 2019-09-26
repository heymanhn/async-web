import React from 'react';
import { faItalic } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import {
  Hotkey,
  RenderMark,
} from '../helpers';

const ITALIC = 'italic';

/* **** Toolbar button **** */

const Container = styled.div({
  cursor: 'pointer',
  margin: 0,
});

export function ItalicButton({ editor, ...props }) {
  const isActive = editor.hasActiveMark(ITALIC);

  function handleClick(event) {
    event.preventDefault();
    editor.toggleMark(ITALIC);
  }

  return (
    <Container
      onClick={handleClick}
      onKeyDown={handleClick}
      {...props}
    >
      <ButtonIcon icon={faItalic} isActive={isActive} />
    </Container>
  );
}

ItalicButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

/* **** Slate plugin **** */

export function ItalicPlugin() {
  function renderItalic(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return <em {...attributes}>{children}</em>;
  }

  return [
    RenderMark(ITALIC, renderItalic),
    Hotkey('mod+i', editor => editor.toggleMark(ITALIC)),
  ];
}
