import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const Icon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  position: 'absolute',
  marginTop: '10px',
  marginLeft: '10px',

  color: colors.successGreen,
  fontSize: '18px',
  marginRight: '12px',
}));

const AvatarWithIcon = ({ avatarUrl, icon, ...props }) => (
  <Container {...props}>
    <AvatarWithMargin avatarUrl={avatarUrl} size={24} />
    <Icon icon={icon} />
  </Container>
);

AvatarWithIcon.propTypes = {
  avatarUrl: PropTypes.any.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
};

export default AvatarWithIcon;
