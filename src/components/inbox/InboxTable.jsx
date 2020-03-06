import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import { compare } from 'utils/helpers';
import inboxQuery from 'graphql/queries/inbox';
import usePaginatedResource from 'utils/hooks/usePaginatedResource';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import InboxRow from './InboxRow';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '20px 0',
});

const InboxTable = ({ viewMode }) => {
  const inboxRef = useRef(null);
  const { userId } = getLocalUser();

  const { loading, data } = usePaginatedResource(inboxRef, {
    query: inboxQuery,
    key: 'inbox',
    variables: { id: userId, queryParams: { type: viewMode } },
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const { items } = data;
  const sortedItems = (items || [])
    .map(item => item.document || item.discussion)
    .map(resource => resource.updatedAt)
    .sort(compare);

  return (
    <div ref={inboxRef}>
      {sortedItems.map(item => {
        const object = item.document || item.discussion;
        return <InboxRow key={object.id} item={item} />;
      })}
    </div>
  );
};

InboxTable.propTypes = {
  viewMode: PropTypes.oneOf(['all', 'document', 'discussion']).isRequired,
};

export default InboxTable;
