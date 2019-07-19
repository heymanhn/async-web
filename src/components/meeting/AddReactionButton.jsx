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

const StyledIcon = styled(FontAwesomeIcon)(({ basefontsize }) => ({
  cursor: 'pointer',
  fontSize: `${basefontsize}px`,
}));

const PlusSign = styled.div(({ baseFontSize }) => ({
  fontSize: `${baseFontSize - 3}px`,
  marginLeft: '2px',
  marginTop: '-2px',
}));

const AddReactionButton = ({ baseFontSize }) => (
  <Container>
    <StyledIcon basefontsize={baseFontSize} icon={faLaugh} />
    <PlusSign baseFontSize={baseFontSize}>+</PlusSign>
  </Container>
);

AddReactionButton.propTypes = {
  baseFontSize: PropTypes.number,
};

AddReactionButton.defaultProps = {
  baseFontSize: 16,
};

export default AddReactionButton;
