import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'inline',
});

const NameList = ({ names, ...props }) => {
  const uniqueNames = [...new Set(names)];
  const firstNames = uniqueNames.map(fullName => fullName.split(' ')[0]);
  const displayNames = firstNames.slice(0, 2);
  const overflowCount = uniqueNames.length - displayNames.length;

  return (
    <Container {...props}>
      {displayNames.join(', ')}
      {overflowCount > 0 && `, and ${overflowCount} others`}
    </Container>
  );
};

NameList.propTypes = {
  names: PropTypes.array.isRequired,
};

export default NameList;
