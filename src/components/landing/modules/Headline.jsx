import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import EmailCaptureForm from 'components/homepage/EmailCaptureForm';

const Container = styled.div({
  margin: '80px 30px',
});

const Title = styled.div({});

const Description = styled.div({});

// TODO: Use emotion theming to customize the colors intead of passing `mode` to every child
// https://emotion.sh/docs/emotion-theming

const Headline = ({ mode, title, description }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <EmailCaptureForm />
    </Container>
  );
};

Headline.propTypes = {
  mode: PropTypes.oneOf(['light', 'dark']).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Headline;
