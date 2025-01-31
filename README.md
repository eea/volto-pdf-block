# volto-pdf-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-pdf-block)](https://github.com/eea/volto-pdf-block/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-pdf-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-pdf-block/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-pdf-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-pdf-block/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block-develop)

[Volto](https://github.com/plone/volto) add-on

## Features

- Flexible PDF integration in Volto.

NOTE: this addon assumes that, if you're trying to load external hosted PDF
files, you will be using
[@eeacms/volto-corsproxy](https://github.com/eea/volto-corsproxy)

## Getting started

### Try volto-pdf-block with Docker

      git clone https://github.com/eea/volto-pdf-block.git
      cd volto-pdf-block
      make
      make start

Go to http://localhost:3000

### Add volto-pdf-block to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "addons": [
      "@eeacms/volto-pdf-block"
  ],

  "dependencies": {
      "@eeacms/volto-pdf-block": "*"
  }
  ```

- If not, create one:

  ```
  npm install -g yo @plone/generator-volto
  yo @plone/volto my-volto-project --canary --addon @eeacms/volto-pdf-block
  cd my-volto-project
  ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Internal use of PDF library

```JS
import config from '@plone/volto/registry';
import PDF from '@mikecousins/react-pdf';


export const PdfViwer = (props) => {

return (
  <PDF
    file={source.file || source.url}
    content={source.base64}
    binaryContent={source.binary}
    documentInitParameters={source.connection}
    page={page}
    scale={scale}
    onPageRenderSuccess={onPageRenderSuccess}
    onPageRenderFail={onPageRenderFail}
    workerSrc={config.settings.pdfWorkerSrc}
    onDocumentLoadSuccess={onDocumentComplete}
  >
    {({ pdfDocument, pdfPage, canvas }) => (
    <>
      {!pdfDocument && loaderComponent(canvas)}
      {pdfDocument && canvas}
    </>
    )}
  </PDF>
)}
```

## workerSrc

Allows you to specify your own url for the pdf worker.
Default is set by the library to:

```
"//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js"
```

For cases where it is needed to have the library on a different CDN this can be configured on `config.settings.pdfWorkerSrc` the way it is done on [volto-ims-policy](https://github.com/eea/volto-ims-policy/blob/master/src/index.js) which is an add-on that centrilazes configurations for Volto for different add-ons.

```JS
const applyConfig = (config) => {
  ...
  // PDF worker url
  config.settings.pdfWorkerSrc = '//www.eea.europa.eu/pdfjs/pdf.worker.min.js';
  return config;
};
```

## Release

See [RELEASE.md](https://github.com/eea/volto-pdf-block/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-pdf-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-pdf-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
