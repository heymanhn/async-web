const newDocumentCommand = {
  icon: 'plus-circle',
  title: 'New document',
  action: () => {},
  shortcut: 'N',
};

const newDiscussionCommand = {
  icon: 'plus-circle',
  title: 'New discussion',
  action: () => {},
  shortcut: 'D',
};

const invitePeopleCommand = {
  icon: 'user-circle',
  title: 'Invite people',
  action: () => {},
  shortcut: 'P',
};

const inviteTeamCommand = {
  icon: 'user-circle',
  title: 'Invite your team',
  action: () => {},
  shortcut: 'T',
};

const goToInboxCommand = {
  icon: 'arrow-circle-right',
  title: 'Go to Inbox',
  action: () => {},
  shortcut: 'I',
};

const commands = {
  inbox: [newDocumentCommand, newDiscussionCommand, inviteTeamCommand],
  document: [
    newDocumentCommand,
    newDiscussionCommand,
    invitePeopleCommand,
    goToInboxCommand,
  ],
  discussion: [
    newDiscussionCommand,
    newDocumentCommand,
    invitePeopleCommand,
    goToInboxCommand,
  ],
};

export default commands;
