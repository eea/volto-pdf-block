import { defineMessages } from 'react-intl';

const messages = defineMessages({
  pdfBlockTitle: {
    id: 'pdfBlockTitle',
    defaultMessage: 'PDF Block',
  },
  hideToolbar: {
    id: 'hideToolbar',
    defaultMessage: 'Hide toolbar',
  },
  hideNavbar: {
    id: 'hideNavbar',
    defaultMessage: 'Hide navbar',
  },
  disableScroll: {
    id: 'disableScroll',
    defaultMessage: 'Disable page scroll',
  },
  initialPage: {
    id: 'initialPage',
    defaultMessage: 'Initial page',
  },
  fitPageWidth: {
    id: 'fitPageWidth',
    defaultMessage: 'Fit page width',
  },
  clickToDownload: {
    id: 'clickToDownload',
    defaultMessage: 'Click to download',
  },
  showPagesPreview: {
    id: 'showPagesPreview',
    defaultMessage: 'Show pages preview',
  },
  default: {
    id: 'default',
    defaultMessage: 'Default',
  },
});

const PDFBlockSchema = (intl) => ({
  title: intl.formatMessage(messages.pdfBlockTitle),
  properties: {
    hideToolbar: {
      type: 'boolean',
      title: intl.formatMessage(messages.hideToolbar),
    },
    hideNavbar: {
      type: 'boolean',
      title: intl.formatMessage(messages.hideNavbar),
    },
    disableScroll: {
      type: 'boolean',
      title: intl.formatMessage(messages.disableScroll),
    },
    initialPage: {
      type: 'number',
      title: intl.formatMessage(messages.initialPage),
      default: 1,
    },
    fitPageWidth: {
      type: 'boolean',
      title: intl.formatMessage(messages.fitPageWidth),
    },
    clickToDownload: {
      type: 'boolean',
      title: intl.formatMessage(messages.clickToDownload),
    },
    showPagesPreview: {
      type: 'boolean',
      title: intl.formatMessage(messages.showPagesPreview),
    },
  },
  fieldsets: [
    {
      id: 'default',
      title: intl.formatMessage(messages.default),
      fields: [
        'hideToolbar',
        'hideNavbar',
        'disableScroll',
        'fitPageWidth',
        'clickToDownload',
        'showPagesPreview',
        'initialPage',
      ],
    },
  ],
  required: [],
});

export default PDFBlockSchema;
