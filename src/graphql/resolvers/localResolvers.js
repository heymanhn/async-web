import workspaceResolvers from './workspace';
import discussionResolvers from './discussion';
import documentResolvers from './document';
import inboxResolvers from './inbox';
import resourceAccessResolvers from './resourceAccess';
import resourceReadStateResolvers from './resourceReadState';

const localResolvers = {
  Mutation: {
    ...workspaceResolvers,
    ...discussionResolvers,
    ...documentResolvers,
    ...inboxResolvers,
    ...resourceAccessResolvers,
    ...resourceReadStateResolvers,
  },
};

export default localResolvers;
