/*
 * Saves the current content once an annotation is added/modified/removed.
 * Only enabled when the message is in display mode, a.k.a "read only"
 *
 * TODO (DISCUSSION V2): There may be a better way to monitor changes.
 * Find it later. Should we table this and work on discussion UI first?
 */
import useMessageMutations from 'hooks/message/useMessageMutations';

const useAnnotationMonitor = (content, setContent, editor, readOnly) => {
  const { children, operations } = editor;
  const { handleUpdate } = useMessageMutations({
    message: children,
  });

  if (!readOnly) return;

  if (operations.length && children.length) {
    console.log('children is: ' + JSON.stringify(children));
    console.log('content is: ' + JSON.stringify(content));

    if (JSON.stringify(children) !== JSON.stringify(content)) {
      handleUpdate();

      // Since the message is in read-only mode, we need to update the
      // content state as well with the changes.
      setContent(children);
    }
  }
};

export default useAnnotationMonitor;
