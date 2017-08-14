# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2017-08-14

### Change
- Refactored code to typescript.

### Remove
- Object manipulation functionality has been droped from JST (the `merge`,
  `contains`, `iterate` functions). We now use `lodash` instead.
- The `Validator` class has been removed, roll this out yourselves.

### Add
- A changelog!
- Comprehensive benchmark suite for all internal functionality.
- Json pointer `get` and `set` functions.
- More documentation using the `docco` package, we now publish this to guthub pages as well.

### Fix
- `dereference` circular schema dereferencing.

## [1.0.0] - 2017-06-25

### Changed

- Version number to stable `1.0.0`, besides that this release introduces no
  other modifications to the project, it simply locks down a stable version.
