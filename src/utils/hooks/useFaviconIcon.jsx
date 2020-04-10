import { useQuery } from '@apollo/react-hooks';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { getLocalUser } from 'utils/auth';

const useFaviconIcon = () => {
  const favicon = window.document.getElementById('favicon');
  const { userId } = getLocalUser();

  const { data } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: 'users', resourceId: userId, queryParams: {} },
  });

  if (!data || !data.resourceNotifications) return null;
  const { items } = data.resourceNotifications;
  if (!items) return null;

  const unreadNotifications = (items || []).filter(n => n.readAt < 0);
  if (unreadNotifications.length > 0) {
    favicon.href = '/favicon-new.png';
  } else {
    favicon.href = '/favicon.png';
  }

  return null;
};

export default useFaviconIcon;
