import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Backdrop = styled.div(({ color, theme: { colors } }) => ({
  background: `${colors[color]}`,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1000,
}));

const Container = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  overflowX: 'hidden',
  overflowY: 'auto',
  width: '100vw',
  height: '100vh',
  zIndex: 1050,
});

const Dialog = styled.div({
  margin: '100px auto',
});

const Modal = ({ backdropColor, children, isOpen, ...props }) => {
  const root = window.document.getElementById('root');

  // // Figure out where the toolbar should be displayed based on the user's text selection
  // function calculateToolbarPosition() {
  //   if (!isOpen || !ref.current) return {};

  //   const native = window.getSelection();
  //   const range = native.getRangeAt(0);
  //   const rect = range.getBoundingClientRect();

  //   return {
  //     top: `${rect.top + window.pageYOffset - ref.current.offsetHeight}px`,
  //     left: `${rect.left + window.pageXOffset - ref.current.offsetWidth / 2 + rect.width / 2}px`,
  //   };
  // }

  return isOpen ? ReactDOM.createPortal(
    <>
      <Container>
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
  isOpen: PropTypes.bool.isRequired,
};

Modal.defaultProps = {
  overlayColor: 'white',
};

export default Modal;
