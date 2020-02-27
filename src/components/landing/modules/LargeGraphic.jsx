import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import {
  SmallTitle as Title,
  SmallDescription as Description,
  TitleIcon,
} from './styles';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  display: 'flex',
  flexDirection: 'column',

  background: bgColors.main,
  padding: '60px 30px',

  [mq('tabletUp')]: {
    alignItems: 'center',
    padding: '80px 30px',
  },
}));

const StyledImage = styled.img(({ theme: { mq } }) => ({
  boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)',
  maxWidth: 'calc(100% + 60px)',
  marginLeft: '-30px',
  marginRight: '-30px',

  [mq('tabletUp')]: {
    marginLeft: '30px',
    marginRight: '30px',
    maxWidth: 'calc(100% - 60px)',
  },
}));

const LargeGraphic = ({ icon, title, description, image }) => (
  <Container>
    {icon && <TitleIcon icon={icon} />}
    <Title>{title}</Title>
    <Description>{description}</Description>
    <StyledImage srcSet={`${image} 2x`} />
  </Container>
);

LargeGraphic.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

LargeGraphic.defaultProps = {
  icon: null,
};

export default LargeGraphic;
