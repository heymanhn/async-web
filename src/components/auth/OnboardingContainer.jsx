import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const OuterContainer = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  marginTop: '100px',
  width: '100%',
  height: '100vh',
});

const InnerContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  padding: '50px',
  width: '600px',
}));

const OnboardingContainer = ({ children }) => (
  <OuterContainer>
    <InnerContainer>
      {children}
    </InnerContainer>
  </OuterContainer>
);

OnboardingContainer.propTypes = {
  children: PropTypes.array.isRequired,
};

export default OnboardingContainer;
