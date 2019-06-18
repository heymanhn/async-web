import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  padding: '0px 20px',
});

const InnerContainer = styled.div(({
  theme: { colors, containerMargin, documentContainerMargin, shortMargin, maxViewport, mq },
  isDocument,
}) => ({
  background: isDocument ? colors.white : 'none',
  margin: shortMargin,

  [mq('tabletUp')]: {
    margin: isDocument ? documentContainerMargin : containerMargin,
    maxWidth: maxViewport,
  },
}));

const PageContainer = ({ children, ...props }) => (
  <Container>
    <InnerContainer {...props}>
      {children}
    </InnerContainer>
  </Container>
);

PageContainer.propTypes = {
  children: PropTypes.any.isRequired,
  isDocument: PropTypes.bool,
};

PageContainer.defaultProps = {
  isDocument: false,
};

export default PageContainer;
