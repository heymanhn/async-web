/*
 * Custom Title editable div, primarily to work around focus issues with
 * multiple Slate instances on the page.
 *
 * Tracking issue: https://github.com/ianstormtaylor/slate/pull/3506
 */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import styled from '@emotion/styled';

import useAutoSave from 'hooks/editor/useAutoSave';
import useDisambiguatedResource from 'hooks/resources/useDisambiguatedResource';
import { titleize } from 'utils/helpers';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  position: 'relative',
  margin: '0 auto',
  width: discussionViewport,
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  lineHeight: '54px',
  marginTop: '60px',
  marginBottom: '15px',
  outline: 'none',
  width: '100%',
}));

const Placeholder = styled(Title)(({ theme: { colors } }) => ({
  color: colors.titlePlaceholder,
  cursor: 'text',
  position: 'absolute',
  userSelect: 'none',
}));

const TitleEditable = ({
  autoFocus,
  initialTitle,
  handleUpdateTitle,
  ...props
}) => {
  const resource = useDisambiguatedResource();
  const { resourceType, setForceUpdate } = resource;

  // These refs are needed so that handleUpdate(), which may be called inside a
  // setTimeout(), will have the up-to-date values.
  const titleRef = useRef(null);
  const initialTitleRef = useRef(initialTitle);
  initialTitleRef.current = initialTitle;

  const [title, setTitle] = useState(initialTitle);
  const [showPlaceholder, setShowPlaceholder] = useState(!title);
  const [elementHeight, setElementHeight] = useState(null);

  // Workaround to prevent DOM from updating
  const [DOMTitle, setDOMTitle] = useState(initialTitle);

  useEffect(() => {
    document.title = `${initialTitle ||
      `Untitled ${titleize(resourceType)}`} - Roval`;
    setTitle(initialTitle);
    const { current } = titleRef || {};
    if (current && current.innerText !== initialTitle)
      setDOMTitle(initialTitle);
  }, [initialTitle, resourceType]);

  const handleUpdate = () => {
    const { current } = titleRef || {};
    if (!current) return null;

    const newTitle = current.innerText;
    if (newTitle === initialTitleRef.current) return null;

    return handleUpdateTitle(newTitle);
  };

  useAutoSave({
    content: title,
    handleSave: handleUpdate,
    isJSON: false,
  });

  useEffect(() => {
    const { current } = titleRef || {};
    if (autoFocus && current) current.focus();
  }, [autoFocus]);

  const handleCheckPlaceholder = event => {
    event.preventDefault();
    const { current } = titleRef || {};

    if (current && !!current.innerText === showPlaceholder) {
      setShowPlaceholder(!showPlaceholder);
    }
  };

  const handleSelectTitle = event => {
    event.preventDefault();
    const { current } = titleRef || {};

    if (current) current.focus();
  };

  // Because this is an uncontrolled input component, we need to manually tell
  // the DOM to update once the height of the component changes
  const handleForceUpdate = () => {
    const { current } = titleRef || {};
    if (current) {
      const { offsetHeight } = current;
      if (elementHeight !== offsetHeight) {
        setElementHeight(offsetHeight);
        setForceUpdate(true);
      }
    }
  };

  const handleKeyDown = event => {
    const { current } = titleRef || {};

    if (isHotkey('Enter', event)) {
      event.preventDefault();

      if (current) {
        // ALERT: A little hacky, but since triggering events to React
        // elements doesn't work, look for the next sibling to this element's
        // parent and focus it. Doesn't work if order of elements changes.
        const { parentNode } = current;
        const { nextSibling } = parentNode;
        if (nextSibling) nextSibling.focus();
      }

      return;
    }

    setTitle(current.innerText);
    setTimeout(handleForceUpdate, 0);
  };

  return (
    <Container>
      <Title
        contentEditable
        ref={titleRef}
        dangerouslySetInnerHTML={{ __html: DOMTitle }}
        onBlur={handleUpdate}
        onInput={handleCheckPlaceholder}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        {...props}
      />
      {showPlaceholder && (
        <Placeholder onClick={handleSelectTitle} {...props}>
          {`Untitled ${titleize(resourceType)}`}
        </Placeholder>
      )}
    </Container>
  );
};

TitleEditable.propTypes = {
  autoFocus: PropTypes.bool,
  initialTitle: PropTypes.string,
  handleUpdateTitle: PropTypes.func.isRequired,
};

TitleEditable.defaultProps = {
  autoFocus: false,
  initialTitle: '',
};

export default TitleEditable;
