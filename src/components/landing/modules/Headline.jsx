import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import EmailCaptureForm from 'components/homepage/EmailCaptureForm';
import { LargeTitle as Title, LargeDescription as Description } from './styles';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  display: 'flex',
  flexDirection: 'column',

  background: bgColors.main,
  padding: '80px 30px 100px',

  [mq('tabletUp')]: {
    alignItems: 'center',
    padding: '100px 30px 180px',
  },
}));

const Headline = ({ title, description, ...props }) => {
  return (
    <Container {...props}>
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
