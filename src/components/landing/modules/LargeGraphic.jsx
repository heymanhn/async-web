import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import {
  SmallTitle as Title,
  SmallDescription as Description,
  TitleIcon,
  Image,
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

const StyledTitle = styled(Title)(({ theme: { mq } }) => ({
  [mq('tabletUp')]: {
    maxWidth: '520px',
    textAlign: 'center',
  },
}));

const StyledDescription = styled(Description)(({ theme: { mq } }) => ({
  marginBottom: '30px',

  [mq('tabletUp')]: {
    maxWidth: '580px',
    textAlign: 'center',
  },
}));

const LargeGraphic = ({ icon, title, description, image, ...props }) => (
  <Container {...props}>
    {icon && <TitleIcon icon={icon} />}
    <StyledTitle>{title}</StyledTitle>
    <StyledDescription>{description}</StyledDescription>
    <Image srcSet={`${image} 2x`} />
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
