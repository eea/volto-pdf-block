import React from 'react';
import PropTypes from 'prop-types';

//import loadable from '@loadable/component';
import PDF from '@mikecousins/react-pdf';

// const PDF = loadable(() => import('react-pdf-js'), {
//   fallback: () => <div>Loading PDF file...</div>,
// });

// import Navigation from './Navigation';
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

  render() {
    const source = this.props.document;
    const { loader, scale, hideNavbar, navigation, css } = this.props;

    const { page, pages } = this.state;

    const NavigationElement = navigation;

    const pdf = (
      <PDF
        file={source.file || source.url}
        content={source.base64}
        binaryContent={source.binary}
        documentInitParameters={source.connection}
        loading={loader}
        page={page}
        scale={scale}
        workerSrc={`//www.eea.europa.eu/pdfjs/pdf.worker.min.js`}
        onDocumentLoadSuccess={this.onDocumentComplete}
      />
    );

    let nav = null;
    if (!hideNavbar && pages > 0) {
      nav = (
        <NavigationElement
          page={page}
          pages={pages}
          handleNextClick={this.handleNextClick}
          handlePrevClick={this.handlePrevClick}
        />
      );
    }

    return (
      <div
        className={css ? css : 'mgrpdf__wrapper'}
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
