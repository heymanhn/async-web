import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Container = styled.li({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: '5px',
  width: '100%',
});

const IconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 !important',
});

const StyledIcon = styled(FontAwesomeIcon)(({ ischecked, theme: { colors } }) => ({
  color: ischecked === 'true' ? colors.grey3 : colors.grey4,
  fontSize: '14px',
}));

const Contents = styled.div(({ isChecked, theme: { colors } }) => ({
  color: isChecked ? colors.grey4 : colors.contentText,
  fontSize: '16px',
  margin: '0 0 0 10px !important',
}));

const ChecklistItem = ({ attributes, children, editor, node }) => {
  const isChecked = node.data.get('isChecked');
  const icon = isChecked ? faCheckSquare : faSquare;

  function handleClick(event) {
    event.preventDefault();
    return editor.setNodeByKey(node.key, { data: { isChecked: !isChecked } });
  }

  function handleMouseDown(event) {
    event.preventDefault();
  }

  return (
    <Container {...attributes}>
      <IconContainer onClick={handleClick} onMouseDown={handleMouseDown}>
        <StyledIcon ischecked={isChecked.toString()} icon={icon} />
      </IconContainer>
      <Contents isChecked={isChecked}>
        {children}
      </Contents>
    </Container>
  );
};

ChecklistItem.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
  editor: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
};

export default ChecklistItem;
