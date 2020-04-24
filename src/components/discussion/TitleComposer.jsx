import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import { DiscussionContext } from 'utils/contexts';

import TitleEditable from 'components/shared/TitleEditable';

const StyledTitleEditable = styled(TitleEditable)({
  marginBottom: '30px',
});

const TitleComposer = ({ initialTitle, ...props }) => {
  const { handleUpdateTitle } = useDiscussionMutations();
  const { readOnly } = useContext(DiscussionContext);

  return (
    <StyledTitleEditable
      initialTitle={initialTitle}
      readOnly={readOnly}
      handleUpdateTitle={handleUpdateTitle}
      {...props}
    />
  );
};

TitleComposer.propTypes = {
  initialTitle: PropTypes.string,
};

TitleComposer.defaultProps = {
  initialTitle: '',
};

export default TitleComposer;
