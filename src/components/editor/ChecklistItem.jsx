import React from 'react';
import PropTypes from 'prop-types';
import { Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const Container = styled.li({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  marginBottom: '5px',
  width: '100%',
});

const IconContainer = styled.div(({ isReadOnly }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: isReadOnly ? 'not-allowed' : 'pointer',
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
  const editor = useSlate();
  const { isChecked } = element;
  const icon = isChecked ? 'check-square' : 'square';
  const isReadOnly = ReactEditor.isReadOnly(editor);

  async function handleClick(event) {
    event.preventDefault();
    if (isReadOnly) return;

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
        isReadOnly={isReadOnly}
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
