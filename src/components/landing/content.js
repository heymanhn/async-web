import writeClearly from 'images/writeClearly.png';
import writeDiscuss from 'images/writeDiscuss.png';
import cmdCenter from 'images/cmdCenter.png';
import contributeAsync from 'images/contributeAsync.png';
import workspace from 'images/workspace.png';

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
        'Write, discuss, and share knowledge at scale – all in one tool',
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      title: 'Write, discuss, and build knowledge in one place',
      description: 'With one tool, everyone sees the whole picture.',
      image: writeDiscuss,
    },
  },
  {
    type: SIDE_GRAPHIC,
    side: 'left',
    content: {
      icon: 'comments-alt',
      title: 'Stay focus, Stay connected',
      description:
        'No pressure to be always online. Follow a discussion from start to finish without missing a beat.',
      image: contributeAsync,
      features: [
        {
          icon: 'arrow-circle-right',
          title: 'Stop scheduling meetings',
          description:
            'Start self-documented meetings. Discussions make it easy to capture inputs and follow progress on your schedule.',
          lineBreak: true,
        },
        {
          icon: 'arrow-circle-right',
          title: 'No pressure to respond immediately',
          description:
            'You can take a step back, think about what is being discussed, and follow up with a thoughtful response at a later time.',
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
      title: 'Write Clearly. Bring Clarity.',
      description: 'A powerful editor that makes your words stand out.',
      image: writeClearly,
    },
    features: [
      {
        title: 'Distraction-free writing',
        description:
          'When you begin typing, you’ll only see what’s essential – your words',
        lineBreak: true,
      },
      {
        title: 'Keyboard-first UX',
        description:
          'Styling text is as easy as typing it. Optimized for efficiency with extensive keyboard shortcuts',
        lineBreak: true,
      },
      {
        title: 'Modern editor',
        description:
          'Use `/` command to add rich-text content like code, images, links, and more',
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
        'Use ⌘ + K shortcut for everything. Perform any actions or search your knowledge base in seconds with the command center.',
      image: cmdCenter,
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      title: 'Create a workspace for every team & project',
      description:
        "Get organized with workspaces: documents, discussions, or files. With workspaces, the right people don't get left out and information stays at one place.",
      image: workspace,
    },
  },
  {
    type: REASONS,
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
          title: 'Threaded',
          description:
            'Discussions are organized into threads that stay on topic',
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
    mode: 'dark',
    content: {
      title: 'Ready to give it a spin?',
      description:
        'Roval is in private beta right now. Sign up for early access.',
    },
  },
];

export default moduleList.map(m => ({ ...DEFAULT_PROPERTIES, ...m }));
