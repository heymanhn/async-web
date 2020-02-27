import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey4,
  cursor: 'pointer',
  fontSize: '18px',
  marginTop: '3px',
}));

const OptionIcon = ({ icon }) => <StyledIcon icon={icon} />;

OptionIcon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default OptionIcon;
