# volto-pdf-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-pdf-block)](https://github.com/eea/volto-pdf-block/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-pdf-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-pdf-block/job/master/display/redirect)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-addon-template%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-pdf-block/job/develop/display/redirect)

[Volto](https://github.com/plone/volto) add-on

## Features

- Flexible PDF integration in Volto.

Demo GIF

## Getting started

1. Create new volto project if you don't already have one:

   ```
   $ npm install -g yo @plone/generator-volto
   $ yo @plone/volto my-volto-project --addon @eeacms/volto-pdf-block

   $ cd my-volto-project
   $ yarn add -W @eeacms/volto-pdf-block
   ```

1. If you already have a volto project, just update `package.json`:

   ```JSON
   "addons": [
       "@eeacms/volto-pdf-block"
   ],

   "dependencies": {
       "@eeacms/volto-pdf-block": "^1.0.0"
   }
   ```

1. Install new add-ons and restart Volto:

   ```
   $ yarn
   $ yarn start
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

For cases where it is needed to have the library on a different CDN this can be configured on `config.settings.pdfWorkerSrc` similar to how we do on [volto-ims-policy](https://github.com/eea/volto-ims-policy/blob/master/src/index.js) which is an add-on that centrilazes configurations for Volto for different add-ons.


```JS
const applyConfig = (config) => {
  ...
  // PDF worker url
  config.settings.pdfWorkerSrc = '//www.eea.europa.eu/pdfjs/pdf.worker.min.js';
  return config;
};
```

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-pdf-block/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-pdf-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
