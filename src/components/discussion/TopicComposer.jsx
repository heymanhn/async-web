import React from 'react';
import PropTypes from 'prop-types';

import useDiscussionMutations from 'utils/hooks/useDiscussionMutations';

import TitleEditable from 'components/shared/TitleEditable';

const TopicComposer = ({ initialTopic, ...props }) => {
  const { handleUpdateTopic } = useDiscussionMutations();

  return (
    <TitleEditable
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
