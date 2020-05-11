import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'inline',
});

const NameList = ({ names, ...props }) => {
  const uniqueNames = [...new Set(names)].filter(n => !!n);
  const displayNames = uniqueNames.slice(0, 2);
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
