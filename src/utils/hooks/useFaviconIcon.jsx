import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { getLocalUser } from 'utils/auth';

const useFaviconIcon = () => {
  const { userId } = getLocalUser();

  const { data } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: 'users', resourceId: userId, queryParams: {} },
    skip: !userId,
  });

  useEffect(() => {
    const favicon = window.document.getElementById('favicon');

    if (!userId || !data || !data.resourceNotifications) return;
    const { items } = data.resourceNotifications;
    if (items) {
      const unreadNotifications = (items || []).filter(n => n.readAt < 0);
      if (unreadNotifications.length > 0) {
        favicon.href = '/favicon-new.png';
      } else {
        favicon.href = '/favicon.png';
      }
    }
  }, [data, userId]);
};

export default useFaviconIcon;
