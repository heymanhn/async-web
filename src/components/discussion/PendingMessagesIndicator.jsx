import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  borderRadius: '20px',
  color: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  margin: '0 auto',
  marginBottom: '-31px',
  padding: '5px 25px',
  position: 'relative',
  top: '-48px',
}));

const PendingMessagesIndicator = ({ count, ...props }) => (
  <Container {...props}>
    {`show ${count} new ${Pluralize('reply', count, false)}`}
  </Container>
);

PendingMessagesIndicator.propTypes = {
  count: PropTypes.number.isRequired,
};

export default PendingMessagesIndicator;
