import React from 'react';

import {
  LargeFontButton,
  MediumFontButton,
  BulletedListButton,
  CheckListButton,
  CodeBlockButton,
  BlockQuoteButton,
} from './buttons';
import VerticalDivider from './VerticalDivider';

const BlockButtons = () => (
  <>
    <LargeFontButton />
    <MediumFontButton />
    <BulletedListButton />
    <CheckListButton />
    <VerticalDivider />
    <BlockQuoteButton />
    <CodeBlockButton />
  </>
);

export default BlockButtons;
