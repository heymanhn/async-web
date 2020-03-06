import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'center',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  color: colors.blue,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  height: '36px',
  padding: '0 20px 1px',
  marginBottom: '30px',
  marginTop: '-1px',
  position: 'fixed',
  bottom: 0,
}));

const NewMessagesIndicator = ({ count, ...props }) => (
  <Container {...props}>
    {`show ${count} new ${Pluralize('message', count, false)}`}
  </Container>
);

NewMessagesIndicator.propTypes = {
  count: PropTypes.number.isRequired,
};

export default NewMessagesIndicator;
