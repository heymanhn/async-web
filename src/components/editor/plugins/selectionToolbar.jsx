/* eslint react/prop-types: 0 */
import React from 'react';

import { RenderEditor } from './helpers';
import Toolbar from '../toolbar/Toolbar';

function SelectionToolbar() {
  // const [isOpen, setIsOpen] = useState(false);

  function displayToolbar(props, editor, next) {
    // function updateToolbar() {
    //   // const { isOpen, value } = this.state;
    //   const { fragment, selection } = value;

    //   if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
    //     if (isToolbarVisible) this.setState({ isToolbarVisible: false });
    //     return;
    //   }

    //   if (!isToolbarVisible) this.setState({ isToolbarVisible: true });
    // }

    // I Need to be able to do something about the mousedown event

    const { isMouseDown, mode, value } = props;
    const { selection } = value;
    const isOpen = mode !== 'display' && selection.isExpanded && !isMouseDown;
    const children = next();

    return (
      <>
        {children}
        <Toolbar
          editor={editor}
          isOpen={isOpen}
        />
      </>
    );
  }

  return [RenderEditor(displayToolbar)];
}

export default SelectionToolbar;

// async componentDidUpdate(prevProps) {
//   // The editor is only autofocused when initially mounted
//   const { initialValue, mode } = this.props;
//   if (mode === 'edit' && prevProps.mode === 'display') {
//     this.editor.current.focus().moveToEndOfDocument();
//   }

//   // Only set the content of the editor if it's changed (eg. loading a new meeting)
//   if (initialValue !== prevProps.initialValue) {
//     this.loadInitialValue();
//   } else {
//     this.updateToolbar();
//   }
// }

// loadInitialValue() {
//   const { initialValue, isPlainText } = this.props;
//   let value;

//   if (isPlainText && initialValue) {
//     value = Plain.deserialize(initialValue);
//   } else {
//     const initialJSON = initialValue ? JSON.parse(initialValue) : DEFAULT_VALUE;
//     value = Value.fromJSON(initialJSON);
//   }

//   this.setState({ value }, this.updateToolbar);
// }


// Hide the toolbar as well so that there's no brief appearance of the toolbar in the new
// place where the user's mouse is down
// handleMouseDown(event, editor, next) {
//   // Need to wrap in setTimeout because: https://github.com/ianstormtaylor/slate/issues/2434
//   setTimeout(() => this.setState({ isMouseDown: true, isToolbarVisible: false }), 0);

//   return next();
// }

// handleClick(event, editor, next) {
//   // Need to wrap in setTimeout because: https://github.com/ianstormtaylor/slate/issues/2434
//   setTimeout(() => this.setState({ isMouseDown: false }), 0);

//   return next();
// }
