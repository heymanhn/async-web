import { TEXT_OPTION_TITLE, handleTextOption, TextOption } from '../plugins/blocks/text';
import {
  LARGE_TITLE_OPTION_TITLE,
  SMALL_TITLE_OPTION_TITLE,
  handleLargeTitleOption,
  handleSmallTitleOption,
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
import {
  CODE_BLOCK_OPTION_TITLE,
  handleCodeBlockOption,
  CodeBlockOption,
} from '../plugins/blocks/codeBlock';
import {
  BLOCK_QUOTE_OPTION_TITLE,
  handleBlockQuoteOption,
  BlockQuoteOption,
} from '../plugins/blocks/blockQuote';
import {
  SECTION_BREAK_OPTION_TITLE,
  handleSectionBreakOption,
  SectionBreakOption,
} from '../plugins/blocks/sectionBreak';
import {
  IMAGE_OPTION_TITLE,
  handleImageOption,
  ImageOption,
} from '../plugins/blocks/image';

const BASIC_SECTION = 'BASIC';
const SECTIONS_SECTION = 'SECTIONS';
const MEDIA_SECTION = 'MEDIA';

const optionsList = [
  // Basic section
  {
    section: BASIC_SECTION,
    title: TEXT_OPTION_TITLE,
    Component: TextOption,
    handleSelect: handleTextOption,
  },
  {
    section: BASIC_SECTION,
    title: LARGE_TITLE_OPTION_TITLE,
    Component: LargeTitleOption,
    handleSelect: handleLargeTitleOption,
  },
  {
    section: BASIC_SECTION,
    title: SMALL_TITLE_OPTION_TITLE,
    Component: SmallTitleOption,
    handleSelect: handleSmallTitleOption,
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
    handleSelect: handleCodeBlockOption,
  },
  {
    section: SECTIONS_SECTION,
    title: BLOCK_QUOTE_OPTION_TITLE,
    Component: BlockQuoteOption,
    handleSelect: handleBlockQuoteOption,
  },
  {
    section: SECTIONS_SECTION,
    title: SECTION_BREAK_OPTION_TITLE,
    Component: SectionBreakOption,
    handleSelect: handleSectionBreakOption,
  },

  // Media section
  {
    section: MEDIA_SECTION,
    title: IMAGE_OPTION_TITLE,
    Component: ImageOption,
    handleSelect: handleImageOption,
  },
];

export default optionsList;
