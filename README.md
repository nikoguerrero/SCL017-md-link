# MeowDown Links :cat:

## Índice

* [Meow-Down Links](#meow-down-links)
* [Installation](#installation)
* [CLI Usage](#cli-usage)
* [Library Usage](#library-usage)
* [Exceptions](#exceptions)
* [Workflow diagram](#workflow-diagram)

***

## Meow-Down Links
Meow-Down Links is a library tool for extracting and validating markdown links.

## Installation
Current release requires Node.js

` npm install --save meowDownLinks`

## CLI Usage

```
$ node meowLinks.js ./path/to/file.md
```


### Optional arguments
`--validate` argument returns an href, md text, pathfile, number of line, response status and redirected from path (if there is one).

`--stats` argument returns total and unique links.

`--validate --stats` or `--stats --validate` arguments return total, unique, broken and redirected links.

## Library Usage

Library usage example:
```js
const meowDownLinks = require('meowDownLinks');

meowDownLinks('./text.md')
  .then(results => {
    // results => [{ href, text, line, file }]
  })
  .catch(error => {
    console.log(error.message);
  });

meowDownLinks('./folder/text.md', { validate: true })
  .then(results => {
    // results => [{ href, text, line, file, status, ok, originalHref }]
  })
  .catch(error => {
    console.log(error.message);
  });

meowDownLinks('./folder/dir')
  .then(results => {
    // results => [{ href, text, file }, ...]
  })
  .catch(error => {
    console.log(error.message);
  });

```
### API Reference

meowDownLinks(path, options)

* `path:` a string representing a relative or absolute path.
* `options:` an object for optional arguments for the api.
  - `validate:` a boolean for validating links.
  - `stats:` a boolean for requesting links stats.

*By default, options will be false. If no arguments are set, the promise'll only return an array with an href, text and path to the extracted links file.*



## Exceptions

Is important to remember this library will only extract and validate urls to webpages. **MD images are not supported**.

## Special feature

CLI messages are **personalized**.
- Working URLs are green.
- Broken URLs are red.
- Originally redirected URLs are cyan.

The message also includes a random ASCII cat art drawing.

#### Example:

![cliexample](https://user-images.githubusercontent.com/83680798/131762902-dc8a3800-bbe2-498b-95f1-475132c579bc.png)


## Workflow diagram
