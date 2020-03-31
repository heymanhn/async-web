import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const IconContainer = styled.div({
  display: 'flex',
  width: '32px',
});

const StyledIcon = styled(FontAwesomeIcon)(
  ({ fontSize, theme: { colors } }) => ({
    color: colors.grey1,
    fontSize: fontSize || '20px',
  })
);

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  marginTop: '-2px',
});

const CommandRow = ({ data }) => {
  const { icon, fontSize, title } = data;

  return (
    <>
      <IconContainer>
        <StyledIcon icon={icon} fontSize={fontSize} />
      </IconContainer>
      <Title>{title}</Title>
    </>
  );
};

CommandRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CommandRow;
