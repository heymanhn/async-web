import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import { DiscussionContext } from 'utils/contexts';

import TitleEditable from 'components/shared/TitleEditable';

const StyledTitleEditable = styled(TitleEditable)(
  ({ theme: { discussionViewport } }) => ({
    fontSize: '24px',
    margin: '0 auto',
    padding: '0 30px',
    width: discussionViewport,
  })
);

const TitleEditor = ({ initialTitle, ...props }) => {
  const { handleUpdateDiscussionTitle } = useDiscussionMutations();
  const { readOnly } = useContext(DiscussionContext);

  return (
    <StyledTitleEditable
      initialTitle={initialTitle}
      readOnly={readOnly}
      handleUpdateTitle={handleUpdateDiscussionTitle}
      {...props}
    />
  );
};

TitleEditor.propTypes = {
  initialTitle: PropTypes.string,
};

TitleEditor.defaultProps = {
  initialTitle: '',
};

export default TitleEditor;
