import PDFBlockView from './components/manage/PDFViewer/BlockView';
import PDFBlockEdit from './components/manage/PDFViewer/BlockEdit';
import chartIcon from '@plone/volto/icons/world.svg';

const applyConfig = (config) => {
  const group =
    config.blocks.groupBlocksOrder.findIndex((f) => f.id === 'custom_addons') >
    -1
      ? 'custom_addons'
      : 'common';

  config.blocks.blocksConfig.pdf_viewer = {
    id: 'pdf_viewer',
    title: 'PDF Viewer',
    view: PDFBlockView,
    edit: PDFBlockEdit,
    icon: chartIcon,
    sidebarTab: 1,
    group,
  };

  return config;
};

export default applyConfig;
