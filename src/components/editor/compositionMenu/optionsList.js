import { TEXT_OPTION_TITLE, TextOption } from '../plugins/blocks/text';
import {
  LARGE_TITLE_OPTION_TITLE,
  SMALL_TITLE_OPTION_TITLE,
  LargeTitleOption,
  SmallTitleOption,
} from '../plugins/blocks/headings';
import {
  BULLETED_LIST_OPTION_TITLE,
  NUMBERED_LIST_OPTION_TITLE,
  CHECKLIST_OPTION_TITLE,
  handleBulletedListOption,
  handleNumberedListOption,
  handleChecklistOption,
  BulletedListOption,
  NumberedListOption,
  ChecklistOption,
} from '../plugins/blocks/lists';
import { CODE_BLOCK_OPTION_TITLE, CodeBlockOption } from '../plugins/blocks/codeBlock';
import { BLOCK_QUOTE_OPTION_TITLE, BlockQuoteOption } from '../plugins/blocks/blockQuote';
import { SECTION_BREAK_OPTION_TITLE, SectionBreakOption } from '../plugins/blocks/sectionBreak';
import { IMAGE_OPTION_TITLE, ImageOption } from '../plugins/blocks/image';

const BASIC_SECTION = 'BASIC';
const SECTIONS_SECTION = 'SECTIONS';
const MEDIA_SECTION = 'MEDIA';

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
    title: SMALL_TITLE_OPTION_TITLE,
    Component: SmallTitleOption,
  },

  // Sections section
  {
    section: SECTIONS_SECTION,
    title: BULLETED_LIST_OPTION_TITLE,
    Component: BulletedListOption,
    handleSelect: handleBulletedListOption,
  },
  {
    section: SECTIONS_SECTION,
    title: NUMBERED_LIST_OPTION_TITLE,
    Component: NumberedListOption,
    handleSelect: handleNumberedListOption,
  },
  {
    section: SECTIONS_SECTION,
    title: CHECKLIST_OPTION_TITLE,
    Component: ChecklistOption,
    handleSelect: handleChecklistOption,
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

  // Media section
  {
    section: MEDIA_SECTION,
    title: IMAGE_OPTION_TITLE,
    Component: ImageOption,
  },
];

export default optionsList;
