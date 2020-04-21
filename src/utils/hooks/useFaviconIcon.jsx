import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { getLocalUser } from 'utils/auth';

const useFaviconIcon = () => {
  const { userId } = getLocalUser();

  const { refetch: getNotifications } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: 'users', resourceId: userId, queryParams: {} },
    skip: true,
  });

  useEffect(() => {
    const favicon = window.document.getElementById('favicon');

    const handleFetch = async () => {
      if (!userId) return;

      const { data } = await getNotifications();
      const { items } = data.resourceNotifications;
      if (items) {
        const unreadNotifications = (items || []).filter(n => n.readAt < 0);
        if (unreadNotifications.length > 0) {
          favicon.href = '/favicon-new.png';
        } else {
          favicon.href = '/favicon.png';
        }
      }
    };

    handleFetch();
  }, [getNotifications, userId]);
};

export default useFaviconIcon;
