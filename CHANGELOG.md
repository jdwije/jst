# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2017-08-14

### Changed
- Re-factored code to typescript.
- use `isPointer` internally now.
- Now exports an optimized `npm pack` with minimal file system foot-print.
- Refactor `typings.d.ts` to `./types/index.ts`, we now compile and package our types.
- Improved package scripts, now cleaner and more verbose.
- Simplify package scripts without losing any functionality.

### Removed
- Object manipulation functionality has been dropped from JST (the `merge`,
  `contains`, `iterate` functions). We now use `lodash` instead.
- The `Validator` class has been removed, roll this out yourselves.

### Added
- A changelog!
- Comprehensive benchmark suite for all internal functionality.
- Json pointer `get` and `set` functions.
- More documentation using the `docco` package, we now publish this to Github
  pages as well.
- `lint` step to `travis-ci.yml`
- `benchmark` step to `travis-ci.yml`
- `encodePointer` function for encoding a string for use as a JSON Pointer
- `decodePointer` function for decoding a json pointer string

### Fixed
- `dereference` circular schema dereferencing.
- fixed linting
- `lodash` imports, build size reduced.
- benchmark messages returning out of sync with test run.

## [1.0.0] - 2017-06-25

### Changed

- Version number to stable `1.0.0`, besides that this release introduces no
  other modifications to the project, it simply locks down a stable version.
