const PDFBlockSchema = () => ({
  title: 'PDF Block',
  properties: {
    hideToolbar: {
      type: 'boolean',
      title: 'Hide toolbar',
    },
    hideNavbar: {
      type: 'boolean',
      title: 'Hide navbar',
    },
    disableScroll: {
      type: 'boolean',
      title: 'Disable page scroll',
    },
    initialPage: {
      type: 'number',
      title: 'Initial page',
      default: 1,
    },
  },
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['hideToolbar', 'hideNavbar', 'disableScroll', 'initialPage'],
    },
  ],
  required: [],
});

export default PDFBlockSchema;
