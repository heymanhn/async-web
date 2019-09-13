import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ avatarUrl, square, size }) => ({
  background: `url('${avatarUrl}')`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: square ? '5px' : '50%',
  width: `${size}px`,
  height: `${size}px`,
}));

const Avatar = ({ square, avatarUrl, size, ...props }) => (
  <Container square={square} avatarUrl={avatarUrl} size={size} {...props} />
);

Avatar.propTypes = {
  avatarUrl: PropTypes.any.isRequired,
  className: PropTypes.string,
  square: PropTypes.bool,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  className: '',
  square: false,
  size: 60, // in pixels
};

export default Avatar;
