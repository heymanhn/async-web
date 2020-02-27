import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import EmailCaptureForm from 'components/homepage/EmailCaptureForm';
import { SmallTitle as Title, SmallDescription as Description } from './styles';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  display: 'flex',
  justifyContent: 'center',
  background: bgColors.main,
  padding: '60px 30px',

  [mq('tabletUp')]: {
    padding: '80px 30px',
  },
}));

const InnerContainer = styled.div(({ theme: { mq } }) => ({
  width: '100%',

  [mq('tabletUp')]: {
    maxWidth: '600px',
  },
}));

const StyledTitle = styled(Title)({
  marginBottom: '10px',
});

const StyledDescription = styled(Description)({
  marginBottom: '25px',
});

const EmailCapture = ({ title, description, ...props }) => {
  return (
    <Container {...props}>
      <InnerContainer>
        <StyledTitle>{title}</StyledTitle>
        <StyledDescription>{description}</StyledDescription>
        <EmailCaptureForm />
      </InnerContainer>
    </Container>
  );
};

EmailCapture.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default EmailCapture;
