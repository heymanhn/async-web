import largeGraphic from 'images/roval-screenshot-1.png';
import sideGraphic from 'images/roval-screenshot-2.png';
import { HEADLINE, LARGE_GRAPHIC, SIDE_GRAPHIC, REASONS } from './modules';

const DEFAULT_PROPERTIES = {
  mode: 'light',
};

const moduleList = [
  {
    type: HEADLINE,
    content: {
      title: 'All your discussions, in one place.',
      description:
        'Roval is an app that does something great. Everyone should use it. The description might exceed one line. That’s fine.',
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      icon: 'comments-alt',
      title: 'Super Feature One',
      description:
        'This feature kicks the competition out of the park. Once you use it, you won’t be able to turn back. We guarantee.',
      image: largeGraphic,
    },
  },
  {
    type: SIDE_GRAPHIC,
    side: 'right',
    content: {
      icon: 'file-alt',
      title: 'Super Feature Two',
      description:
        'Take a look at this beautiful screenshot of the product. We’re describing how it works right here.',
      image: sideGraphic,
    },
  },
  {
    type: REASONS,
    mode: 'dark',
    content: {
      icon: 'bell',
      title: 'Super Reasons',
      description:
        'Here are a number of reasons why this next set of features is up your alley. Read each of them carefully.',
      reasons: [
        {
          icon: ['fal', 'arrow-circle-right'],
          title: 'Reason 1',
          description: 'Explanation one. This is the reason why it’s so great.',
        },
        {
          icon: 'terminal',
          title: 'Reason 2',
          description: 'Explanation two. Fits at most two lines, so be terse.',
        },
        {
          icon: 'comments-alt',
          title: 'Reason 3',
          description:
            'Explanation three. One icon, one reason, one explanation.',
        },
        {
          icon: ['fal', 'arrow-circle-right'],
          title: 'Reason 4',
          description:
            'Explanation four. This is the reason why it’s so great.',
        },
        {
          icon: 'terminal',
          title: 'Reason 5',
          description: 'Explanation five. Fits at most two lines, so be terse.',
        },
        {
          icon: 'comments-alt',
          title: 'Reason 6',
          description:
            'Explanation six. One icon, one reason, one explanation.',
        },
      ],
    },
  },
  {
    type: SIDE_GRAPHIC,
    side: 'left',
    content: {
      icon: 'list-ul',
      title: 'Super Feature Three',
      description:
        'Take a look at this beautiful screenshot of the product. We’re describing how it works right here.',
      image: sideGraphic,
      features: [
        {
          icon: 'arrow-circle-right',
          title: 'List item 1',
          description:
            'Some text followed by some not so bold text. Anything can be here.',
          lineBreak: true,
        },
        {
          icon: 'arrow-circle-right',
          title: 'List item 2.',
          description:
            'Some text followed by some not so bold text. But it’s inline.',
        },
        {
          icon: 'arrow-circle-right',
          title: 'List item 3.',
          description:
            'Some text followed by some not so bold text. Also inline.',
        },
      ],
    },
  },
];

export default moduleList.map(m => ({ ...DEFAULT_PROPERTIES, ...m }));
