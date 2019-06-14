import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ src, square, size }) => ({
  background: `url(${src})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: square ? 'none' : '50%',
  width: `${size}px`,
  height: `${size}px`,
}));

const Avatar = ({ className, square, src, size }) => (
  <Container className={className} square={square} src={src} size={size} />
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
