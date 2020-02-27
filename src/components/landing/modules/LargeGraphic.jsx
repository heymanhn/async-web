import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

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

const Title = styled.div(({ theme: { mq, textColors } }) => ({
  color: textColors.main,
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '-0.021em',
  lineHeight: '39px',
  marginBottom: '10px',

  [mq('tabletUp')]: {
    fontSize: '36px',
    lineHeight: '44px',
    maxWidth: '520px',
    textAlign: 'center',
  },
}));

const Description = styled.div(({ theme: { mq, textColors } }) => ({
  color: textColors.alt,
  fontSize: '18px',
  letterSpacing: '-0.014em',
  lineHeight: '28px',
  marginBottom: '30px',

  [mq('tabletUp')]: {
    maxWidth: '580px',
    textAlign: 'center',
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

const LargeGraphic = ({ title, description, image }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <StyledImage srcSet={`${image} 2x`} />
    </Container>
  );
};

LargeGraphic.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default LargeGraphic;
