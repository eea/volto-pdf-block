import React from 'react';
import PropTypes from 'prop-types';
import config from '@plone/volto/registry';
import PDF from '@mikecousins/react-pdf';

// Based on
// https://raw.githubusercontent.com/MGrin/mgr-pdf-viewer-react/master/src/index.js

const mgrpdfStyles = {};

mgrpdfStyles.wrapper = {
  textAlign: 'center',
};

class PDFViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: 0,
      page: 1,
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({
      pages: null,
      page: this.props.page || 1,
    });
  }

  componentWillReceiveProps({ page }) {
    this.setState({ page: page || this.state.page });
  }

  onDocumentComplete = (pages) => {
    this.setState(
      {
        pages: pages.numPages,
      },
      () => this.props.onDocumentComplete(this.state),
    );
  };

  handlePrevClick = () => {
    if (this.state.page === 1) return;

    this.setState({
      page: this.state.page - 1,
    });
  };

  handleNextClick = () => {
    if (this.state.page === this.state.pages) return;

    this.setState({
      page: this.state.page + 1,
    });
  };

  onPageRenderSuccess = (PDFPageProxy) => {
    this.setState({
      loading: false,
    });
  };

  onPageRenderFail = (PDFPageProxy) => {
    this.setState({
      loading: false,
    });
  };

  render() {
    const source = this.props.document;
    const { loader, scale, hideNavbar, navigation, css } = this.props;
    const { page, pages } = this.state;
    const NavigationElement = navigation;

    const loaderComponent = (canvas) => (
      <div
        className="block pdf_viewer selected"
        tabindex="-1"
        style={{ outline: 'none', height: "100%" }}
      >
          <div tabindex="0">
            <div className="ui message">
              <div
                className="ui active transition visible dimmer"
                style={{ display: 'flex !important;' }}
              ></div>
              <div
                className="ui active transition visible dimmer"
                style={{ display: 'flex !important;' }}
              >
                <div className="content">
                  <div className="ui indeterminate text loader">
                  </div>
                </div>
              </div>
              {canvas}
            </div>
          </div>
      </div>
    )

    const pdf = (
      <PDF
        file={source.file || source.url}
        content={source.base64}
        binaryContent={source.binary}
        documentInitParameters={source.connection}
        loading={loader || this.state.loading}
        page={page}
        scale={scale}
        onPageRenderSuccess={this.onPageRenderSuccess}
        onPageRenderFail={this.onPageRenderFail}
        workerSrc={config.settings.pdfWorkerSrc}
        onDocumentLoadSuccess={this.onDocumentComplete}
      >
        {({ pdfDocument, pdfPage, canvas }) => (
          <>
            {!pdfDocument && loaderComponent(canvas)}
            {pdfDocument && canvas}
          </>
        )}
      </PDF>
    );

    const nav = !hideNavbar && pages > 0 ? (
        <NavigationElement
          page={page}
          pages={pages}
          handleNextClick={this.handleNextClick}
          handlePrevClick={this.handlePrevClick}
        />
      ) : null;

    return (
      <div
        className={!this.state.loading && css ? css : 'mgrpdf__wrapper'}
        style={mgrpdfStyles.wrapper}
      >
        {pdf}
        {nav}
      </div>
    );
  }
}

PDFViewer.propTypes = {
  document: PropTypes.shape({
    file: PropTypes.any, // File object,
    url: PropTypes.string,
    connection: PropTypes.shape({
      url: PropTypes.string.isRequired, // URL to fetch the pdf
    }),
    base64: PropTypes.string, // PDF file encoded in base64
    binary: PropTypes.shape({
      // UInt8Array
      data: PropTypes.any,
    }),
  }).isRequired,

  loader: PropTypes.node,
  page: PropTypes.number,
  scale: PropTypes.number,
  css: PropTypes.string,
  onDocumentClick: PropTypes.func,
  onDocumentComplete: PropTypes.func,

  hideNavbar: PropTypes.bool,
  navigation: PropTypes.oneOfType([
    // Can be an object with css classes or react elements to be rendered
    PropTypes.shape({
      css: PropTypes.shape({
        previousPageBtn: PropTypes.string,
        nextPageBtn: PropTypes.string,
        pages: PropTypes.string,
        wrapper: PropTypes.string,
      }),
      elements: PropTypes.shape({
        previousPageBtn: PropTypes.any,
        nextPageBtn: PropTypes.any,
        pages: PropTypes.any,
      }),
    }),
    // Or a full navigation component
    PropTypes.any,
  ]),
};

PDFViewer.defaultProps = {
  scale: 1,
};

export default PDFViewer;
