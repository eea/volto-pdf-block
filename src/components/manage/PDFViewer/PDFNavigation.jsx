import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@plone/volto/components';
import prevSVG from '@plone/volto/icons/left-key.svg';
import nextSVG from '@plone/volto/icons/right-key.svg';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  nextPage: {
    id: 'Next Page',
    defaultMessage: 'Next Page',
  },
  previousPage: {
    id: 'Previous Page',
    defaultMessage: 'Previous Page',
  },
  of: {
    id: 'of',
    defaultMessage: 'of',
  },
});

export const CustomPrevButton = (props) => {
  const { page, handlePrevClick, intl } = props;
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
      title={intl.formatMessage(messages.previousPage)}
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

export const CustomNextButton = (props) => {
  const { page, pages, handleNextClick, intl } = props;
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
      title={intl.formatMessage(messages.nextPage)}
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

export const CustomPages = (props) => {
  const { page, pages, intl } = props;
  return (
    <p className="pdf-pages">
      {page} {intl.formatMessage(messages.of)} {pages}
    </p>
  );
};
CustomPages.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
};

const CustomNavigation = (props) => {
  const { page, pages, handlePrevClick, handleNextClick } = props;
  const intl = useIntl();

  return (
    <div className="pdf-toolbar pdf-toolbar-bottom">
      <div>
        <CustomPrevButton
          intl={intl}
          page={page}
          pages={pages}
          handlePrevClick={handlePrevClick}
        />
        <CustomNextButton
          intl={intl}
          page={page}
          pages={pages}
          handleNextClick={handleNextClick}
        />
      </div>
      <CustomPages page={page} pages={pages} intl={intl} />
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
