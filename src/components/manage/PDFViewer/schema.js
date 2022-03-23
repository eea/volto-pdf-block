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
    fitPageWidth: {
      type: 'boolean',
      title: 'Fit page width',
    },
    clickToDownload: {
      type: 'boolean',
      title: 'Click to download',
    },
  },
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'hideToolbar',
        'hideNavbar',
        'disableScroll',
        'fitPageWidth',
        'clickToDownload',
        'initialPage',
      ],
    },
  ],
  required: [],
});

export default PDFBlockSchema;
