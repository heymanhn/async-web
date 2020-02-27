import largeGraphic from 'images/roval-screenshot-1.png';
import sideGraphic from 'images/roval-screenshot-2.png';
import { HEADLINE, LARGE_GRAPHIC, SIDE_GRAPHIC } from './modules';

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
    type: SIDE_GRAPHIC,
    side: 'left',
    mode: 'dark',
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
  // {
  //   type: REASONS,
  //   mode: 'dark',
  //   content: {
  //     title: 'Super Feature One',
  //     description:
  //       'This feature kicks the competition out of the park. Once you use it, you won’t be able to turn back. We guarantee.',
  //     imageUrl: 'images/roval-screenshot-1.png',
  //   },
  // },
];

export default moduleList.map(m => ({ ...DEFAULT_PROPERTIES, ...m }));
