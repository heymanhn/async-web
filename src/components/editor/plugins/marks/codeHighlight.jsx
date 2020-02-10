/* eslint react/prop-types: 0 */
import { DEFAULT_NODE } from 'components/editor/utils';
import { CustomEnterAction } from '../helpers';

const CODE_HIGHLIGHT = 'code-highlight';

function CodeHighlight() {
  function unmarkHighlight(editor, next) {
    if (editor.hasActiveMark(CODE_HIGHLIGHT)) {
      return editor.insertBlock(DEFAULT_NODE).removeMark(CODE_HIGHLIGHT);
    }

    return next();
  }

  return [CustomEnterAction(unmarkHighlight)];
}

export default CodeHighlight;
