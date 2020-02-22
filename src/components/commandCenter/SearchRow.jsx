import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useResourceDetails from 'utils/hooks/useResourceDetails';

const IconContainer = styled.div({
  marginTop: '-20px',
  width: '32px',
});

const StyledIcon = styled(FontAwesomeIcon)({
  fontSize: '16px',
});

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  marginTop: '-2px',
});

const SearchRow = ({ data }) => {
  const { type, icon, title, resource } = data;
  const [resourceType] = type.match(/document|discussion/);

  const ResourceDetails = useResourceDetails(resourceType, resource);
  if (!ResourceDetails) return null;

  return (
    <>
      <IconContainer>
        <StyledIcon icon={icon} />
      </IconContainer>
      <div>
        <Title>{title}</Title>
        <ResourceDetails />
      </div>
    </>
  );
};

SearchRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SearchRow;
