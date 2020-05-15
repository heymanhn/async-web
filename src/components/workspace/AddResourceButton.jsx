import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useDisambiguatedResource from 'hooks/resources/useDisambiguatedResource';
import { DEFAULT_NAVIGATION_CONTEXT, NavigationContext } from 'utils/contexts';

import CommandCenterModal from 'components/commandCenter/CommandCenterModal';

const IconContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  width: '40px',
  height: '32px',
}));

const StyledIcon = styled(FontAwesomeIcon)(
  ({ theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 20 }),
    color: colors.grey2,
  })
);

const AddResourceButton = props => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const resource = useDisambiguatedResource();

  const value = {
    ...DEFAULT_NAVIGATION_CONTEXT,
    resource: { ...resource, customMode: 'addResource' },
  };

  return (
    <NavigationContext.Provider value={value}>
      <IconContainer onClick={() => setIsModalOpen(true)} {...props}>
        <StyledIcon icon={['far', 'plus']} />
      </IconContainer>
      <CommandCenterModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </NavigationContext.Provider>
  );
};

export default AddResourceButton;
