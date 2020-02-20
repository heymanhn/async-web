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

  ':hover': {
    background: colors.grey7,
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

const CommandRow = ({ data, isSelected, ...props }) => {
  const { icon, title, action } = data;

  return (
    <Container isSelected={isSelected} onClick={action} {...props}>
      <StyledIcon icon={icon} />
      <Title>{title}</Title>
    </Container>
  );
};

CommandRow.propTypes = {
  data: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default CommandRow;
