export const DEFAULT_NODE = 'paragraph';
export const DEFAULT_PLAIN_NODE = 'line';

export const DEFAULT_VALUE = {
  document: {
    nodes: [
      {
        object: 'block',
        type: DEFAULT_NODE,
        nodes: [
          {
            object: 'text',
            text: '',
          },
        ],
      },
    ],
  },
};

export const TOOLBAR_SOURCE = 'toolbar';
export const COMPOSITION_MENU_SOURCE = 'compositionMenu';
export const HOTKEY_SOURCE = 'hotkey';
export const MARKDOWN_SOURCE = 'markdown';
export const CUT_PASTE_SOURCE = 'cutAndPaste';
