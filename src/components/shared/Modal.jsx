import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Backdrop = styled.div(({ customStyle, theme: { colors } }) => ({
  background: colors.white,
  opacity: 0.75,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1000,
  ...customStyle,
}));

const Container = styled.div({
  display: 'flex',
  justifyContent: 'center',

  position: 'fixed',
  top: 0,
  left: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  width: '100vw',
  height: '100vh',
  zIndex: 1050,
});

const Dialog = styled.div(({ theme: { colors, documentViewport } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '100px auto',
  width: documentViewport,
}));

const Modal = ({ backdropStyle, children, handleClose, isOpen, ...props }) => {
  const root = window.document.getElementById('root');

  document.body.style.overflow = isOpen ? 'hidden' : 'auto';

  return isOpen ? ReactDOM.createPortal(
    <>
      <Container onClick={handleClose}>
        <Dialog onClick={e => e.stopPropagation()} {...props}>
          {children}
        </Dialog>
      </Container>
      <Backdrop customStyle={backdropStyle} />
    </>,
    root,
  ) : null;
};

Modal.propTypes = {
  backdropStyle: PropTypes.object,
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

Modal.defaultProps = {
  backdropStyle: {},
};

export default Modal;
