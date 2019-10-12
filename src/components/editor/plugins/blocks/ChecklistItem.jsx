import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const IconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledIcon = styled(FontAwesomeIcon)(({ ischecked, theme: { colors } }) => ({
  color: ischecked === 'true' ? colors.grey3 : colors.grey4,
  fontSize: '14px',
}));

const Contents = styled.div(({ isChecked, theme: { colors } }) => ({
  color: isChecked ? colors.grey4 : 'initial',
  fontSize: '16px',
  marginLeft: '10px',
}));

const ChecklistItem = ({ attributes, children, editor, node }) => {
  const isChecked = node.data.get('isChecked');
  const icon = isChecked ? faCheckSquare : faSquare;

  function handleClick() {
    return editor.setBlocks({ data: { isChecked: !isChecked } });
  }

  return (
    <Container {...attributes}>
      <IconContainer onClick={handleClick}>
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
