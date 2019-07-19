import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaugh } from '@fortawesome/free-regular-svg-icons';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey3,

  ':hover': {
    color: colors.grey2,
  },
}));

const StyledIcon = styled(FontAwesomeIcon)(({ customsize }) => ({
  cursor: 'pointer',
  fontSize: customsize === 'small' ? '16px' : '18px',
}));

const PlusSign = styled.div({
  fontWeight: 500,
}, ({ size }) => {
  if (size === 'small') {
    return {
      fontSize: '13px',
      marginLeft: '1px',
      marginTop: '-2px',
    };
  }

  return {
    fontSize: '15px',
    marginLeft: '2px',
    marginTop: '-4px',
  };
});

const AddReactionButton = ({ size, ...props }) => (
  <Container {...props}>
    <StyledIcon customsize={size} icon={faLaugh} />
    <PlusSign size={size}>+</PlusSign>
  </Container>
);

AddReactionButton.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
};

AddReactionButton.defaultProps = {
  size: 'small',
};

export default AddReactionButton;
