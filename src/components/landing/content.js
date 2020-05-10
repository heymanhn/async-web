import writeClearly from 'assets/writeClearly.png';
import writeDiscuss from 'assets/writeDiscuss.png';
import cmdCenter from 'assets/cmdCenter.png';
import contributeAsync from 'assets/contributeAsync.png';
import workspace from 'assets/workspace.png';

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
      title: 'A new standard for team communication',
      description:
        'Candor is a distraction-free space that streamlines team communication and knowledge sharing.',
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      title: 'Built for all types of team communication',
      description:
        'Better documents and better discussions makes better decisions',
      image: writeDiscuss,
    },
  },
  {
    type: SIDE_GRAPHIC,
    side: 'left',
    content: {
      icon: 'comments-alt',
      title: 'A distraction-free workplace',
      description:
        'Follow a discussion from start to finish without missing a beat.',
      image: contributeAsync,
      features: [
        {
          icon: 'arrow-circle-right',
          title: 'Write things up vs. chat it down',
          description:
            'Better discussions start and end with an exchange of complete thoughts, not one-line-at-a-time messages.',
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
            'Candor does not demand your immediate attention. Yet, it gently reminds everyone to move the work forward.',
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
      title: 'Create a workspace for every team or project',
      description:
        "Get organized with workspaces: documents, discussions, or files. With workspaces, the right people don't get left out and information stays at one place.",
      image: workspace,
    },
  },
  {
    type: REASONS,
    content: {
      title: 'Why teams love using Candor?',
      reasons: [
        {
          icon: ['fal', 'arrow-circle-right'],
          title: 'Asynchronous',
          description: 'Contribute asynchronously on your schedule',
        },
        {
          icon: ['fal', 'comments-alt'],
          title: 'Conversational',
          description: 'Ask questions, share knowledge, or discuss ideas',
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
          description: 'Threads keep conversations organized and on-topic',
        },
        {
          icon: ['fal', 'file-search'],
          title: 'Transparent',
          description: 'Escape email & app silos with searchable discussions',
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
        'Candor is in private alpha right now. Sign up for early access.',
    },
  },
];

export default moduleList.map(m => ({ ...DEFAULT_PROPERTIES, ...m }));
