import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRandom } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import useHover from 'utils/hooks/useHover';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  color: colors.bgGrey,
  cursor: 'pointer',
  marginTop: '15px',
  padding: '8px 20px',

  ':hover': {
    background: colors.darkHoverBlue,
  },
}));

const MainContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const IconContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  marginRight: '15px',
  width: '24px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.bgGrey,
  fontSize: '16px',
}));

const ButtonLabel = styled.div({
  fontSize: '14px',
  marginTop: '1px',
})

const HintText = styled.div(({ hover, theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  opacity: hover ? 1 : 0,
}));

const SwitchToButton = () => {
  const { hover, ...hoverProps } = useHover();

  return (
    <Container {...hoverProps}>
      <MainContainer>
        <IconContainer><StyledIcon icon={faRandom} /></IconContainer>
        <ButtonLabel>Switch to...</ButtonLabel>
      </MainContainer>
      <HintText hover={hover}>
        ⌘ + K
      </HintText>
    </Container>
  );
};

export default SwitchToButton;
