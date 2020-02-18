import React from 'react';

import {
  LargeFontButton,
  MediumFontButton,
  BulletedListButton,
  CodeBlockButton,
  BlockQuoteButton,
} from './buttons';
import VerticalDivider from './VerticalDivider';

const BlockButtons = () => (
  <>
    <LargeFontButton />
    <MediumFontButton />
    <BulletedListButton />
    <VerticalDivider />
    <BlockQuoteButton />
    <CodeBlockButton />
  </>
);

export default BlockButtons;
