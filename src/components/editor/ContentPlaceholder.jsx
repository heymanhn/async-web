import React from 'react';
import styled from '@emotion/styled';

const Container = styled.span(({ theme: { colors } }) => ({
  color: colors.textPlaceholder,
  pointerEvents: 'none',
}));

const SlashKey = styled.span(({ theme: { colors } }) => ({
  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '3px',
  margin: '0 4px',
  padding: '2px 6px',
}));

const ContentPlaceholder = props => (
  <Container {...props}>
    Type
    <SlashKey>/</SlashKey>
    for options
  </Container>
);

export default ContentPlaceholder;
