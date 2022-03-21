const PDFBlockSchema = () => ({
  title: 'PDF Block',
  properties: {
    hideToolbar: {
      type: 'boolean',
      title: 'Hide toolbar',
    },
  },
  fieldsets: [{ id: 'default', title: 'Default', fields: ['hideToolbar'] }],
  required: [],
});

export default PDFBlockSchema;
