import workspaceResolvers from './workspace';
import discussionResolvers from './discussion';
import documentResolvers from './document';
import inboxResolvers from './inbox';
import resourceAccessResolvers from './resourceAccess';
import resourceReadStateResolvers from './resourceReadState';
import notificationsResolvers from './notifications';
import userResourcesResolvers from './userResources';

const localResolvers = {
  Mutation: {
    ...workspaceResolvers,
    ...discussionResolvers,
    ...documentResolvers,
    ...inboxResolvers,
    ...resourceAccessResolvers,
    ...resourceReadStateResolvers,
    ...notificationsResolvers,
    ...userResourcesResolvers,
  },
};

export default localResolvers;
