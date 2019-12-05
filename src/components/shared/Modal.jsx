import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Backdrop = styled.div(({ color, theme: { colors } }) => ({
  background: `${colors[color]}`,
  opacity: 0.75,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1000,
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

const Modal = ({ backdropColor, children, handleClose, isOpen, ...props }) => {
  const root = window.document.getElementById('root');

  return isOpen ? ReactDOM.createPortal(
    <>
      <Container onClick={handleClose}>
        <Dialog {...props}>
          {children}
        </Dialog>
      </Container>
      <Backdrop color={backdropColor} />
    </>,
    root,
  ) : null;
};

Modal.propTypes = {
  backdropColor: PropTypes.string,
  children: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

Modal.defaultProps = {
  backdropColor: 'white',
};

export default Modal;
