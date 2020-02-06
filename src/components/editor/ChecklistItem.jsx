import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';

const Container = styled.li({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  marginBottom: '5px',
  width: '100%',
});

const IconContainer = styled.div(({ isAuthor }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: isAuthor ? 'pointer' : 'not-allowed',
  margin: '0 !important',
  position: 'relative',
  top: '1px',
}));

const StyledIcon = styled(FontAwesomeIcon)(
  ({ ischecked, theme: { colors } }) => ({
    color: ischecked === 'true' ? colors.grey3 : colors.grey4,
    fontSize: '14px',
  })
);

const Contents = styled.div(({ isChecked, theme: { colors } }) => ({
  color: isChecked ? colors.grey4 : colors.contentText,
  fontSize: '16px',
  margin: '0 0 0 10px !important',
  flexWrap: 'wrap',
}));

const ChecklistItem = ({ attributes, children, element }) => {
  const { mode } = useContext(MessageContext);
  const editor = useSlate();
  const { isChecked } = element;
  const icon = isChecked ? faCheckSquare : faSquare;
  const isAuthor = mode !== 'display';

  async function handleClick(event) {
    event.preventDefault();
    if (!isAuthor) return;

    Transforms.setNodes(
      editor,
      { isChecked: !isChecked },
      { at: ReactEditor.findPath(editor, element) }
    );
  }

  function handleMouseDown(event) {
    event.preventDefault();
  }

  return (
    <Container {...attributes}>
      <IconContainer
        isAuthor={isAuthor}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        <StyledIcon ischecked={isChecked.toString()} icon={icon} />
      </IconContainer>
      <Contents isChecked={isChecked}>{children}</Contents>
    </Container>
  );
};

ChecklistItem.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.object.isRequired,
};

export default ChecklistItem;
