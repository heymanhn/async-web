import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const Container = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',

  background: isSelected ? colors.grey7 : colors.bgGrey,
  cursor: 'pointer',
  height: '54px',
  padding: '0 30px',
  userSelect: 'none',

  ':last-of-type': {
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
  },
}));

const StyledIcon = styled(FontAwesomeIcon)({
  fontSize: '20px',
  marginRight: '12px',
});

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  marginTop: '-2px',
});

const CommandRow = ({ data, isSelected, handleClose, ...props }) => {
  const { icon, title, action } = data;

  const handleClick = event => {
    event.preventDefault();
    action();
    handleClose();
  };

  return (
    <Container isSelected={isSelected} onClick={handleClick} {...props}>
      <StyledIcon icon={icon} />
      <Title>{title}</Title>
    </Container>
  );
};

CommandRow.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CommandRow;
