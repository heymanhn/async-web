/* eslint import/prefer-default-export: 0 */
export const WORKSPACES_QUERY_SIZE = 25;
export const RESOURCES_QUERY_SIZE = 10;
export const ORG_WORKSPACES_QUERY_SIZE = 100;

// Resource access types
export const DEFAULT_ACCESS_TYPE = 'collaborator';

// Pusher/notification events
export const NEW_MESSAGE_EVENT = 'new_message';
export const DOCUMENT_ACCESS_EVENT = 'access_document';
export const DISCUSSION_ACCESS_EVENT = 'access_discussion';
export const DOCUMENT_EDIT_EVENT = 'edit_document';
export const DISCUSSION_EDIT_EVENT = 'edit_discussion';
export const DISCUSSION_RESOLVE_EVENT = 'resolve_discussion';
export const BADGE_COUNT_EVENT = 'badge_count';

export const VIEW_MODES = [
  {
    mode: 'all',
    displayText: 'All',
  },
  {
    mode: 'document',
    displayText: 'Documents',
  },
  {
    mode: 'discussion',
    displayText: 'Discussions',
  },
];

// for Moment.JS
// Includes custom formatting to replace months with weeks
export const RELATIVE_TIME_STRINGS = {
  s: '1s',
  ss: '%ds',
  m: '1m',
  mm: '%dm',
  h: '1h',
  hh: '%dh',
  d: '1d',
  dd: numDays => {
    if (numDays < 7) return `${numDays}d`; // Moment uses "d" when it's just 1 day.

    const weeks = Math.round(numDays / 7);
    return `${weeks}w`;
  },
  y: '1yr',
  yy: '%dyrs',
};

// Default icons for each main resource
export const RESOURCE_ICONS = {
  document: 'file-alt',
  discussion: 'comments-alt',
  workspace: 'layer-group',
};
