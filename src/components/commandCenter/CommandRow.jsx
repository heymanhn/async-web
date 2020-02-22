import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const StyledIcon = styled(FontAwesomeIcon)({
  fontSize: '20px',
  marginRight: '12px',
});

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  marginTop: '-2px',
});

const CommandRow = ({ data }) => {
  const { icon, title } = data;

  return (
    <>
      <StyledIcon icon={icon} />
      <Title>{title}</Title>
    </>
  );
};

CommandRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CommandRow;
