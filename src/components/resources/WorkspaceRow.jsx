import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import workspaceQuery from 'graphql/queries/workspace';
import { RESOURCE_ICONS } from 'utils/constants';

const Container = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',

  marginTop: '15px',
});

const Details = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const IconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '10px',
  width: '24px',
});

const StyledIcon = styled(FontAwesomeIcon)(
  ({ isdisabled, theme: { colors } }) => ({
    color: isdisabled === 'true' ? colors.grey4 : colors.grey1,
    fontSize: '16px',
  })
);

const Title = styled.div(({ theme: { colors } }) => ({
  cursor: 'default',
  color: colors.grey0,
  fontSize: '14px',
  fontWeight: 500,
  marginTop: '-1px',
}));

const RemoveButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',
  marginTop: '-1px',

  ':hover': {
    color: colors.blue,
  },
}));

const WorkspaceRow = ({ workspaceId, handleRemove }) => {
  const { data } = useQuery(workspaceQuery, { variables: { workspaceId } });

  if (!data || !data.workspace) return null;

  const { title } = data.workspace;

  const handleRemoveWrapper = () => handleRemove(workspaceId);

  return (
    <Container>
      <Details>
        <IconContainer>
          <StyledIcon icon={RESOURCE_ICONS.workspace} />
        </IconContainer>
        <Title>{title}</Title>
      </Details>
      <RemoveButton onClick={handleRemoveWrapper}>remove</RemoveButton>
    </Container>
  );
};

WorkspaceRow.propTypes = {
  workspaceId: PropTypes.string.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default WorkspaceRow;
