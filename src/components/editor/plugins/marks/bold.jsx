import React from 'react';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import ButtonIcon from 'components/editor/toolbar/ButtonIcon';
import {
  Hotkey,
  RenderMark,
} from '../helpers';

const BOLD = 'bold';

const Container = styled.div({
  cursor: 'pointer',
  margin: 0,
});

export function BoldButton({ editor, ...props }) {
  const isActive = editor.hasActiveMark(BOLD);

  function handleClick(event) {
    event.preventDefault();
    editor.toggleMark(BOLD);
  }

  return (
    <Container
      onClick={handleClick}
      onKeyDown={handleClick}
      {...props}
    >
      <ButtonIcon icon={faBold} isActive={isActive} />
    </Container>
  );
}

BoldButton.propTypes = {
  editor: PropTypes.object.isRequired,
};

export function BoldPlugin() {
  function renderBold(props) {
    const { attributes, children } = props; /* eslint react/prop-types: 0 */

    return <strong {...attributes}>{children}</strong>;
  }

  return [
    RenderMark(BOLD, renderBold),
    Hotkey('mod+b', editor => editor.toggleMark(BOLD)),
  ];
}
