import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',

  background: colors.white,
  color: colors.grey4,
  cursor: 'default',
  height: '60px',
  padding: '0 30px',
  opacity: 0.95,
  position: 'fixed',
  bottom: 0,
  right: 0,
}));

const Label = styled.div({
  fontWeight: 500,
});

const Timestamp = styled(Moment)({
  marginLeft: '4px',
});

const LastUpdatedIndicator = ({ timestamp }) => (
  <Container>
    <Label>Updated</Label>
    <Timestamp fromNow parse="X">
      {timestamp}
    </Timestamp>
  </Container>
);

LastUpdatedIndicator.propTypes = {
  timestamp: PropTypes.number.isRequired,
};

export default LastUpdatedIndicator;
