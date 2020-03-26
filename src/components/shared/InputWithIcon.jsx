import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  background: colors.bgGrey,
  borderTop: `1px solid ${colors.borderGrey}`,
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '0 25px',
  width: '100%',
}));

const IconContainer = styled.div({
  width: '30px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '16px',
  padding: '15px 0',
}));

const StyledInput = styled.input(({ theme: { colors } }) => ({
  // Remove all default styles for an input element
  WebkitAppearance: 'none',

  color: colors.grey0,
  fontSize: '16px',
  letterSpacing: '-0.011em',

  '::placeholder': {
    color: colors.grey4,
    opacity: 1, // Firefox
  },
}));

const InputWithIcon = ({ icon, placeholder, value, setValue }) => (
  <Container>
    <IconContainer>
      <StyledIcon icon={icon} />
    </IconContainer>
    <StyledInput
      placeholder={placeholder}
      value={value}
      onChange={event => setValue(event.target.value)}
    />
  </Container>
);

InputWithIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
};

InputWithIcon.defaultProps = {
  value: '',
};

export default InputWithIcon;
