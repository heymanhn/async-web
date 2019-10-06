import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '3px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
}));

const CompositionMenu = ({ handleClose, isOpen, query, ...props }) => {
  const menu = useRef();
  const handleClickOutside = () => {
    if (!isOpen) return;
    handleClose();
  };
  useClickOutside({ handleClickOutside, isOpen, ref: menu });
  return (
    <Container isOpen={isOpen} ref={menu} {...props}>
      Hello
    </Container>
  );
};

CompositionMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  query: PropTypes.string,
};

CompositionMenu.defaultProps = {
  query: '',
};

export default CompositionMenu;
