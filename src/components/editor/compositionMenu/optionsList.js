import {
  TEXT_OPTION_TITLE,
  LARGE_TITLE_OPTION_TITLE,
  MEDIUM_TITLE_OPTION_TITLE,
  BULLETED_LIST_OPTION_TITLE,
  NUMBERED_LIST_OPTION_TITLE,
  CHECKLIST_OPTION_TITLE,
  CODE_BLOCK_OPTION_TITLE,
  BLOCK_QUOTE_OPTION_TITLE,
  SECTION_BREAK_OPTION_TITLE,
} from '../utils';

import {
  TextOption,
  LargeTitleOption,
  MediumTitleOption,
  BulletedListOption,
  NumberedListOption,
  ChecklistOption,
  CodeBlockOption,
  BlockQuoteOption,
  SectionBreakOption,
} from './options';

// IMAGE SUPPORT TODO
// import { IMAGE_OPTION_TITLE, ImageOption } from '../plugins/blocks/image';

const BASIC_SECTION = 'BASIC';
const SECTIONS_SECTION = 'SECTIONS';
// const MEDIA_SECTION = 'MEDIA';

const optionsList = [
  // Basic section
  {
    section: BASIC_SECTION,
    title: TEXT_OPTION_TITLE,
    Component: TextOption,
  },
  {
    section: BASIC_SECTION,
    title: LARGE_TITLE_OPTION_TITLE,
    Component: LargeTitleOption,
  },
  {
    section: BASIC_SECTION,
    title: MEDIUM_TITLE_OPTION_TITLE,
    Component: MediumTitleOption,
  },

  // Sections section
  {
    section: SECTIONS_SECTION,
    title: BULLETED_LIST_OPTION_TITLE,
    Component: BulletedListOption,
  },
  {
    section: SECTIONS_SECTION,
    title: NUMBERED_LIST_OPTION_TITLE,
    Component: NumberedListOption,
  },
  {
    section: SECTIONS_SECTION,
    title: CHECKLIST_OPTION_TITLE,
    Component: ChecklistOption,
  },
  {
    section: SECTIONS_SECTION,
    title: CODE_BLOCK_OPTION_TITLE,
    Component: CodeBlockOption,
  },
  {
    section: SECTIONS_SECTION,
    title: BLOCK_QUOTE_OPTION_TITLE,
    Component: BlockQuoteOption,
  },
  {
    section: SECTIONS_SECTION,
    title: SECTION_BREAK_OPTION_TITLE,
    Component: SectionBreakOption,
  },

  // IMAGE SUPPORT TODO
  // Media section
  // {
  //   section: MEDIA_SECTION,
  //   title: IMAGE_OPTION_TITLE,
  //   Component: ImageOption,
  // },
];

export default optionsList;
