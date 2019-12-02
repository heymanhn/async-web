import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

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

const StyledIcon = styled(FontAwesomeIcon)(({ ischecked, theme: { colors } }) => ({
  color: ischecked === 'true' ? colors.grey3 : colors.grey4,
  fontSize: '14px',
}));

const Contents = styled.div(({ isChecked, theme: { colors } }) => ({
  color: isChecked ? colors.grey4 : colors.contentText,
  fontSize: '1.1rem',
  margin: '0 0 0 10px !important',
  flexWrap: 'wrap',
}));

const ChecklistItem = ({ attributes, children, editor, node }) => {
  const isChecked = node.data.get('isChecked');
  const icon = isChecked ? faCheckSquare : faSquare;
  const { props } = editor;
  const { isAuthor } = props; /* eslint react/prop-types: 0 */

  async function handleClick(event) {
    event.preventDefault();
    if (!isAuthor) return;

    const { readOnly } = editor;
    const change = editor.setNodeByKey(node.key, { data: { isChecked: !isChecked } });

    // Needed so that the handleSubmit logic doesn't block the editor from updating correctly
    if (readOnly) setTimeout(change.props.handleSubmit, 0);
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
