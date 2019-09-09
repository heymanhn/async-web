import React from 'react';
import PropTypes from 'prop-types';
import Truncate from 'react-truncate';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  color: colors.grey6,
  fontSize: '14px',
  margin: '0 -20px',
  padding: '10px 20px',
}));

const MeetingRow = ({ meeting }) => {
  const { title } = meeting;

  return (
    <Container>
      <Truncate width={170} trimWhitespace>{title}</Truncate>
    </Container>
  );
};

MeetingRow.propTypes = { meeting: PropTypes.object.isRequired };

export default MeetingRow;
