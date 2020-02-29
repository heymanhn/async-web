import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';

import TitleEditable from 'components/shared/TitleEditable';

const StyledTitleEditable = styled(TitleEditable)({
  marginBottom: '30px',
});

const TopicComposer = ({ initialTopic, ...props }) => {
  const { handleUpdateTopic } = useDiscussionMutations();

  return (
    <StyledTitleEditable
      initialTitle={initialTopic}
      handleUpdateTitle={handleUpdateTopic}
      {...props}
    />
  );
};

TopicComposer.propTypes = {
  initialTopic: PropTypes.string,
};

TopicComposer.defaultProps = {
  initialTopic: '',
};

export default TopicComposer;
