import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ src, square, size }) => ({
  background: `url(${src})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: square ? '5px' : '50%',
  width: `${size}px`,
  height: `${size}px`,
}));

const Avatar = ({ square, src, size, ...props }) => (
  <Container square={square} src={src} size={size} {...props} />
);

Avatar.propTypes = {
  className: PropTypes.string,
  square: PropTypes.bool,
  src: PropTypes.any.isRequired,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  className: '',
  square: false,
  size: 60, // in pixels
};

export default Avatar;
