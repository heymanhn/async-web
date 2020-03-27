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
  padding: '10px 0',
  width: '30px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '16px',
}));

const StyledInput = styled.input(({ theme: { colors } }) => ({
  flexGrow: 1,

  // Remove all default styles for an input element
  WebkitAppearance: 'none',
  background: 'none',
  border: 'none',

  color: colors.grey0,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  outline: 'none',

  '::placeholder': {
    color: colors.grey4,
    opacity: 1, // Firefox
  },
}));

const InputWithIcon = React.forwardRef(
  ({ icon, placeholder, value, setValue, onKeyDown, ...props }, ref) => (
    <Container {...props}>
      <IconContainer>
        <StyledIcon icon={icon} />
      </IconContainer>
      <StyledInput
        ref={ref}
        placeholder={placeholder}
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        spellCheck="false"
        type="text"
      />
    </Container>
  )
);

InputWithIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func,
};

InputWithIcon.defaultProps = {
  value: '',
  onKeyDown: () => {},
};

export default InputWithIcon;
