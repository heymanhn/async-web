import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import rovalLogo from 'assets/logo.png';

const OuterContainer = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  width: '100%',
});

const InnerContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  margin: '50px 0',
  padding: '50px',
  width: '600px',
}));

const StyledImage = styled.img({
  marginBottom: '12px',
  width: '42px',
  height: '42px',
});

const Title = styled.div({
  fontSize: '24px',
  fontWeight: 500,
  textAlign: 'center',
  width: '300px',
});

const OnboardingContainer = ({ children, title }) => (
  <OuterContainer>
    <InnerContainer>
      <StyledImage src={rovalLogo} alt="Roval logo" />
      <Title>{title}</Title>
      {children}
    </InnerContainer>
  </OuterContainer>
);

OnboardingContainer.propTypes = {
  children: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default OnboardingContainer;
