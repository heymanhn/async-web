import writeClearly from 'images/writeClearly.png';
import writeDiscuss from 'images/writeDiscuss.png';
import cmdCenter from 'images/cmdCenter.png';
import contributeAsync from 'images/contributeAsync.png';

import {
  HEADLINE,
  LARGE_GRAPHIC,
  SIDE_GRAPHIC,
  REASONS,
  EMAIL_CAPTURE,
} from './modules';

const DEFAULT_PROPERTIES = {
  mode: 'light',
};

const moduleList = [
  {
    type: HEADLINE,
    content: {
      title: 'Discuss ideas and build knowledge together',
      description:
        'Teams use Roval to drive better decisions and build productive, inclusive, and transparent communication culture.',
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      title: 'Write, discuss, and make decisions, all in one place.',
      image: writeDiscuss,
    },
  },
  {
    type: SIDE_GRAPHIC,
    side: 'right',
    content: {
      icon: 'comments-alt',
      title: 'Contribute asynchronously',
      description:
        'Follow a discussion from start to finish and communicate asynchronously without missing a beat.',
      image: contributeAsync,
      features: [
        {
          icon: 'arrow-circle-right',
          title: 'Stop scheduling meetings',
          description:
            'Roval makes it easy to provide feedback and follow discussions asynchronously.',
          lineBreak: true,
        },
        {
          icon: 'arrow-circle-right',
          title: 'Contribute on your schedule',
          description:
            'No pressure to respond immediately. You can take a step back, think about what is being discussed, and follow up with a thoughtful response at a later time.',
          lineBreak: true,
        },
        {
          icon: 'arrow-circle-right',
          title: 'Reminders & Notifications',
          description:
            'Roval does not demand your immediate attention. Yet, it gently reminds everyone to move the work forward.',
          lineBreak: true,
        },
      ],
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      title: 'Write Clearly',
      description: 'A powerful editor that makes your words stand out.',
      image: writeClearly,
    },
    features: [
      {
        icon: 'arrow-circle-right',
        title: 'Stop scheduling meetings',
        description:
          'Roval makes it easy to provide feedback and follow discussions asynchronously.',
        lineBreak: true,
      },
      {
        icon: 'arrow-circle-right',
        title: 'Contribute on your schedule',
        description:
          'No pressure to respond immediately. You can take a step back, think about what is being discussed, and follow up with a thoughtful response at a later time.',
        lineBreak: true,
      },
      {
        icon: 'arrow-circle-right',
        title: 'Reminders & Notifications',
        description:
          'Roval does not demand your immediate attention. Yet, it gently reminds everyone to move the work forward.',
        lineBreak: true,
      },
    ],
  },
  {
    type: SIDE_GRAPHIC,
    side: 'right',
    content: {
      icon: 'terminal',
      title: 'Meet your Command Center',
      description:
        'Use ⌘ + K shortcut for everything. Perform any actions or search in seconds with the command center.',
      image: cmdCenter,
    },
  },
  {
    type: REASONS,
    mode: 'dark',
    content: {
      title: 'Why teams switch to Roval?',
      reasons: [
        {
          icon: ['fal', 'arrow-circle-right'],
          title: 'Asynchronous',
          description: 'Contribute asynchronously on your schedule',
        },
        {
          icon: ['fal', 'comments-alt'],
          title: 'Conversational',
          description: 'All your decisions and discussions, in one place',
        },
        {
          icon: ['fal', 'font-case'],
          title: 'Expressive',
          description: 'A modern editor that makes your thoughts stand out',
        },
        {
          icon: ['fal', 'infinity'],
          title: 'Inclusive',
          description: 'Welcomes inputs from everyone without interruptions',
        },
        {
          icon: ['fal', 'comment-lines'],
          title: 'Thoughtful',
          description:
            'Communicate in full thoughts rather than one line at a time',
        },
        {
          icon: ['fal', 'file-search'],
          title: 'Transparent',
          description: 'All discussions and decisions are self-documented',
        },
      ],
    },
  },
  {
    type: EMAIL_CAPTURE,
    content: {
      title: 'Ready to give it a spin?',
      description:
        'Roval is in private beta right now. But happy to give you some access if you’re interested. Let us know.',
    },
  },
];

export default moduleList.map(m => ({ ...DEFAULT_PROPERTIES, ...m }));
