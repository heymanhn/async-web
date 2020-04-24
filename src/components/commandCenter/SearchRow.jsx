import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useResourceDetails from 'hooks/resources/useResourceDetails';

const IconContainer = styled.div({
  width: '32px',
});

const StyledIcon = styled(FontAwesomeIcon)({
  fontSize: '16px',
});

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
});

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  marginTop: '-2px',
});

const SearchRow = ({ data }) => {
  const { type, icon, title, resource } = data;

  const ResourceDetails = useResourceDetails(type, resource);
  if (type !== 'workspace' && !ResourceDetails) return null;

  return (
    <>
      <IconContainer>
        <StyledIcon icon={icon} />
      </IconContainer>
      <RowContainer>
        <Title>{title}</Title>
        {type !== 'workspace' && <ResourceDetails />}
      </RowContainer>
    </>
  );
};

SearchRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchRow;
