# Recipes

A recipe site optimised for the way I cook. That is, using my phone to read the
recipe from.

## Project structure

The site is a static site built with Hugo.

The JS bundle is built from Typescript source files, compiled via Hugo's ESBuild
pipeline.

JS tests are written with Jest.

## Local development

### Installation

Install Node v14.19.1.

Install Node modules with:

```sh
make install
```

### Local HTTP server

Run an auto-loading Hugo site with:

```sh
make server
```

### Testing

Run tests with:

```sh
npm test
```

Run in watch mode with:

```sh
npm test -- --watch
```

### Type checking

Run:

```sh
make typecheck
```
