/* eslint import/prefer-default-export: 0 */
export const WORKSPACES_QUERY_SIZE = 25;
export const RESOURCES_QUERY_SIZE = 10;
export const ORG_WORKSPACES_QUERY_SIZE = 100;

// Resource access types
export const DEFAULT_ACCESS_TYPE = 'collaborator';

// Pusher
export const PUSHER_CHANNEL_PREFIX = 'private-channel';
export const MINIMUM_PUSHER_SEND_INTERVAL = 500; // milliseconds
export const PUSHER_SUBSCRIPTION_SUCCESS_EVENT =
  'pusher:subscription_succeeded';
export const NEW_MESSAGE_EVENT = 'new_message';
export const NEW_THREAD_EVENT = 'new_thread';
export const DOCUMENT_ACCESS_EVENT = 'access_document';
export const DISCUSSION_ACCESS_EVENT = 'access_discussion';
export const DOCUMENT_EDIT_EVENT = 'edit_document';
export const DISCUSSION_EDIT_EVENT = 'edit_discussion';
export const DISCUSSION_RESOLVE_EVENT = 'resolve_discussion';
export const BADGE_COUNT_EVENT = 'badge_count';
export const NEW_DOCUMENT_OPERATION_EVENT = 'client-new_document_operation';
export const NEW_DOCUMENT_TITLE_EVENT = 'client-new_document_title';

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
  past: unit => (unit === '1s' ? 'just now' : `${unit} ago`),
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

// lodash Throttle interval in milliseconds
export const THROTTLE_INTERVAL = 100;

// Delay for showing DOM toolbar
export const SHOW_TOOLBAR_DELAY = 200;

export const DEBOUNCE_INTERVAL = 200;

// TEMPORARY: Demo organization IDs
export const DEMO_ORG_IDS = {
  development: '99818c3e-0279-5f83-bba4-48861ec8c78c',
  production: 'c1336e5e-a26a-5651-b0e5-0ac40d199dc1',
};
