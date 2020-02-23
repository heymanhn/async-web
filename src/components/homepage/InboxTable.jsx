import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { getLocalUser } from 'utils/auth';
import inboxQuery from 'graphql/queries/inbox';
import usePaginatedResource from 'utils/hooks/usePaginatedResource';

import NotFound from 'components/navigation/NotFound';
import InboxRow from './InboxRow';

// For sorting the mixed content
const compare = (a, b) => {
  const objectA = a.document || a.discussion;
  const objectB = b.document || b.discussion;
  const { updatedAt: t1 } = objectA;
  const { updatedAt: t2 } = objectB;

  if (t1 < t2) {
    return 1;
  }
  if (t1 > t2) {
    return -1;
  }

  return 0;
};

const InboxTable = ({ viewMode }) => {
  const inboxRef = useRef(null);
  const { userId } = getLocalUser();

  const key = 'inbox';
  const { loading, data } = usePaginatedResource(inboxRef, {
    query: inboxQuery,
    key,
    variables: { id: userId, queryParams: { type: viewMode } },
  });

  if (loading) return null;
  if (!data.inbox) return <NotFound />;

  const { items } = data.inbox;
  const sortedItems = (items || [])
    .sort(compare)
    .map(item => item.document || item.discussion);

  return (
    <div ref={inboxRef}>
      {sortedItems.map(item => (
        <InboxRow key={item.id} item={item} />
      ))}
    </div>
  );
};

InboxTable.propTypes = {
  viewMode: PropTypes.oneOf(['all', 'document', 'discussion']).isRequired,
};

export default InboxTable;
