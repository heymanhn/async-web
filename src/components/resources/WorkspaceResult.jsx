import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { RESOURCE_ICONS } from 'utils/constants';

const IconContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '40px',
  marginRight: '10px',
});

const StyledIcon = styled(FontAwesomeIcon)(
  ({ isdisabled, theme: { colors } }) => ({
    color: isdisabled === 'true' ? colors.grey4 : colors.grey1,
    fontSize: '16px',
  })
);

const Details = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const Title = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: isDisabled ? colors.grey4 : colors.grey0,
  fontSize: '14px',
  fontWeight: isDisabled ? 500 : 600,
}));

const DisabledMessage = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '13px',
}));

const WorkspaceResult = ({ result, isDisabled }) => {
  const { title } = result;

  return (
    <>
      <IconContainer>
        <StyledIcon
          icon={RESOURCE_ICONS.workspace}
          isdisabled={isDisabled.toString()}
        />
      </IconContainer>
      <Details>
        <Title isDisabled={isDisabled}>{title}</Title>
        {isDisabled && (
          <DisabledMessage>Remove existing workspace first</DisabledMessage>
        )}
      </Details>
    </>
  );
};

WorkspaceResult.propTypes = {
  result: PropTypes.object.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default WorkspaceResult;
