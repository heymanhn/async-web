import { useQuery } from '@apollo/react-hooks';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { getLocalUser } from 'utils/auth';

const useFaviconIcon = () => {
  const favicon = window.document.getElementById('favicon');
  const { userId } = getLocalUser();
  const { pathname } = window.location;

  const { data } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: 'users', resourceId: userId, queryParams: {} },
    skip: !userId || pathname === '/logout',
  });

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
};

export default useFaviconIcon;
