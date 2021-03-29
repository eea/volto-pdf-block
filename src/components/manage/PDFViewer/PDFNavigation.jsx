import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@plone/volto/components';
import prevSVG from '@plone/volto/icons/left-key.svg';
import nextSVG from '@plone/volto/icons/right-key.svg';

export const CustomPrevButton = props => {
  const { page, pages, handlePrevClick } = props;
  if (page === 1) {
    return (
      <button className="pdf-toolbar-btn disabled-btn">
        <Icon name={prevSVG} size="20px" />
      </button>
    );
  }

  return (
    <button
      className="pdf-toolbar-btn"
      title="Previous Page"
      onClick={handlePrevClick}
    >
      <Icon name={prevSVG} size="20px" />
    </button>
  );
};

CustomPrevButton.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
};

export const CustomNextButton = props => {
  const { page, pages, handleNextClick } = props;
  if (page === pages) {
    return (
      <button className="pdf-toolbar-btn disabled-btn">
        <Icon name={nextSVG} size="20px" />
      </button>
    );
  }

  return (
    <button
      className="pdf-toolbar-btn"
      title="Next Page"
      onClick={handleNextClick}
    >
      <Icon name={nextSVG} size="20px" />
    </button>
  );
};

CustomNextButton.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  handleNextClick: PropTypes.func.isRequired,
};

export const CustomPages = props => {
  const { page, pages } = props;
  return (
    <p className="pdf-pages">
      {page} of {pages}
    </p>
  );
};
CustomPages.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
};

const CustomNavigation = props => {
  const { page, pages, handlePrevClick, handleNextClick } = props;

  return (
    <div className="pdf-toolbar pdf-toolbar-bottom">
      <div>
        <CustomPrevButton
          page={page}
          pages={pages}
          handlePrevClick={handlePrevClick}
        />
        <CustomNextButton
          page={page}
          pages={pages}
          handleNextClick={handleNextClick}
        />
      </div>
      <CustomPages page={page} pages={pages} />
    </div>
  );
};
CustomNavigation.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
};

export default CustomNavigation;
