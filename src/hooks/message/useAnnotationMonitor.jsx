/*
 * Update the stored content once an annotation is added/modified/removed.
 * Only enabled when the message is in display mode, a.k.a "read only"
 *
 * We need this because when readOnly is true, any updates to the editor
 * aren't bubbled down.
 */
const useAnnotationMonitor = (content, setContent, editor, readOnly) => {
  const { children, operations } = editor;

  if (!readOnly) return;

  if (
    operations.length &&
    children.length &&
    JSON.stringify(children) !== JSON.stringify(content)
  ) {
    // Since the message is in read-only mode, we need to update the
    // content state as well with the changes.
    setContent(children);
  }
};

export default useAnnotationMonitor;
