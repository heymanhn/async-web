/* eslint react/prop-types: 0 */
import { DEFAULT_NODE } from 'components/editor/utils';
import { CustomEnterAction } from '../helpers';

const CODE_SNIPPET = 'code-snippet';

function CodeSnippet() {
  function unmarkSnippet(editor, next) {
    if (editor.hasActiveMark(CODE_SNIPPET)) {
      return editor.insertBlock(DEFAULT_NODE).removeMark(CODE_SNIPPET);
    }

    return next();
  }

  return [CustomEnterAction(unmarkSnippet)];
}

export default CodeSnippet;
