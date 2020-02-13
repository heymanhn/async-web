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
  fontSize: '12px',
  fontWeight: 500,
  height: '32px',
  width: '130px',
  padding: '0 20px',
  position: 'sticky',
  marginTop: '-32px',
  top: '160px',
  cursor: 'pointer',
  zIndex: 10,
  transition: 'opacity 0.2s',
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
