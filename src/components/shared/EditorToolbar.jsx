import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBold,
  faCode,
  faItalic,
  faListUl,
  faQuoteRight,
} from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

import CustomHeadingIcon from './CustomHeadingIcon';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.mainText,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
  fontSize: '16px',
  height: '40px',
  padding: '0px 5px',
  position: 'absolute',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ enabled, theme: { colors } }) => ({
  color: enabled ? colors.selectedValueBlue : colors.bgGrey,
  cursor: 'pointer',
  margin: '5px 10px',

  ':hover': {
    color: colors.selectedValueBlue,
  },
}));

const VerticalDivider = styled.div(({ theme: { colors } }) => ({
  borderRight: `1px solid ${colors.grey1}`,
  height: '24px',
  margin: '0 5px',
}));

const EditorToolbar = () => (
  <Container>
    <StyledIcon icon={faBold} />
    <StyledIcon icon={faItalic} />
    <VerticalDivider />

    <CustomHeadingIcon number={1} />
    <CustomHeadingIcon number={2} />
    <StyledIcon icon={faListUl} />
    <VerticalDivider />

    <StyledIcon icon={faQuoteRight} />
    <StyledIcon icon={faCode} />
  </Container>
);

export default EditorToolbar;
