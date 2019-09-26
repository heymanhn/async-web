import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const StyledIcon = styled(FontAwesomeIcon)(({ isactive, theme: { colors } }) => ({
  color: isactive === 'true' ? colors.selectedValueBlue : colors.bgGrey,
  cursor: 'pointer',
  margin: '5px 10px',

  ':hover': {
    color: colors.selectedValueBlue,
  },
}));

const ButtonIcon = ({ icon, isActive }) => (
  <StyledIcon
    icon={icon}
    isactive={isActive.toString()}
  />
);

ButtonIcon.propTypes = {
  icon: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default ButtonIcon;
