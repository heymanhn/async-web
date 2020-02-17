import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from './Avatar';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const StyledAvatar = styled(Avatar)(({ opacity }) => ({
  marginLeft: '-2px',
  ':first-of-type': {
    marginLeft: 0,
  },
  opacity,
}));

const AvatarWithCount = styled.div(({ size, square, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  background: colors.grey4,
  borderRadius: square ? '5px' : '50%',
  fontSize: '10px',
  color: colors.white,
  letterSpacing: '0.01em',
  width: `${size}px`,
  height: `${size}px`,
  marginLeft: '-2px',
  fontWeight: 500,
  paddingBottom: '1px',
}));

const AvatarList = ({ avatarUrls, size, opacity, ...props }) => {
  const uniqueAvatarUrls = [...new Set(avatarUrls)];
  const displayUrls = uniqueAvatarUrls.slice(0, 2);
  const overflowCount = uniqueAvatarUrls.length - displayUrls.length;

  return (
    <Container {...props}>
      {displayUrls.map(url => (
        <StyledAvatar avatarUrl={url} size={size} key={url} opacity={opacity} />
      ))}
      {overflowCount > 0 && (
        <AvatarWithCount size={size}>{`+${overflowCount}`}</AvatarWithCount>
      )}
    </Container>
  );
};

AvatarList.propTypes = {
  avatarUrls: PropTypes.array.isRequired,
  size: PropTypes.number,
  opacity: PropTypes.number,
};

AvatarList.defaultProps = {
  size: 24, // in pixels
  opacity: 1,
};

export default AvatarList;
