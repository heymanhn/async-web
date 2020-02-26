import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import EmailCaptureForm from 'components/homepage/EmailCaptureForm';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  background: bgColors.main,
  padding: '80px 30px',

  [mq('tabletUp')]: {
    padding: '100px 30px',
  },
}));

const Title = styled.div(({ theme: { mq, textColors } }) => ({
  color: textColors.main,
  fontSize: '48px',
  fontWeight: 700,
  letterSpacing: '-0.022em',
  lineHeight: '58px',
  margin: '0 auto 20px',

  [mq('tabletUp')]: {
    fontSize: '52px',
    lineHeight: '63px',
    maxWidth: '520px',
    textAlign: 'center',
  },
}));

const Description = styled.div(({ theme: { mq, textColors } }) => ({
  color: textColors.alt,
  fontSize: '20px',
  letterSpacing: '-0.017em',
  lineHeight: '32px',
  margin: '0 auto 30px',

  [mq('tabletUp')]: {
    maxWidth: '580px',
    textAlign: 'center',
  },
}));

// TODO: Use emotion theming to customize the colors intead of passing `mode` to every child
// https://emotion.sh/docs/emotion-theming

const Headline = ({ title, description }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <EmailCaptureForm />
    </Container>
  );
};

Headline.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Headline;
