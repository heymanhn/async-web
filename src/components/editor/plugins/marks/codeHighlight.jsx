/* eslint react/prop-types: 0 */
import { DEFAULT_BLOCK_TYPE } from 'components/editor/utils';
import { CustomEnterAction } from '../helpers';

const CODE_HIGHLIGHT = 'code-highlight';

function CodeHighlight() {
  function unmarkHighlight(editor, next) {
    if (editor.hasActiveMark(CODE_HIGHLIGHT)) {
      return editor.insertBlock(DEFAULT_BLOCK_TYPE).removeMark(CODE_HIGHLIGHT);
    }

    return next();
  }

  return [CustomEnterAction(unmarkHighlight)];
}

export default CodeHighlight;
