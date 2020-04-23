import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import { compareOnProperty } from 'utils/helpers';
import usePrefetchQueries from 'hooks/shared/usePrefetchQueries';
import inboxQuery from 'graphql/queries/inbox';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import InboxRow from './InboxRow';

const VIEW_MODES = ['all', 'document', 'discussion'];

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '20px 0',
});

const InboxTable = ({ viewMode }) => {
  const inboxRef = useRef(null);
  const { userId } = getLocalUser();

  const buildQueryDetails = () =>
    VIEW_MODES.map(mode => ({
      query: inboxQuery,
      variables: { userId, queryParams: { type: mode } },
    }));

  usePrefetchQueries(buildQueryDetails());

  const { loading, data } = usePaginatedResource(inboxRef, {
    query: inboxQuery,
    key: 'inbox',
    variables: { userId, queryParams: { type: viewMode } },
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const { items } = data;
  const propertyLookup = i => (i.document || i.discussion).updatedAt;
  const sortedItems = (items || []).sort(compareOnProperty(propertyLookup));

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
  viewMode: PropTypes.oneOf(VIEW_MODES).isRequired,
};

export default InboxTable;
