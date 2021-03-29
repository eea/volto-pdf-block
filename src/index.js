import PDFBlockView from "./components/manage/PDFViewer/BlockView";
import PDFBlockEdit from "./components/manage/PDFViewer/BlockEdit";
import chartIcon from "@plone/volto/icons/world.svg";

const applyConfig = (config) => {
  config.blocks.blocksConfig.pdf_viewer = {
    id: "pdf_viewer",
    title: "PDF Viewer",
    view: PDFBlockView,
    edit: PDFBlockEdit,
    icon: chartIcon,
    group: "custom_addons",
    sidebarTab: 1,
  };

  return config;
};

export default applyConfig;
