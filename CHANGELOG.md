# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4] - 2024-05-10
### Changed
- Renamed `federated_credential` table to `federated_credentials`, following
a pluralized naming convention due to the fact that the `users` table must be
plural.

## [0.0.3] - 2024-05-08
### Fixed
- Fixed `ENOENT` error that occurs when attempting to create `grants` table.

## [0.0.2] - 2024-05-08
### Fixed
- Fixed "ReferenceError: fs is not defined" by `require()`'ing necessary
module.

## [0.0.1] - 2024-05-08

- Initial release.

[Unreleased]: https://github.com/authnomicon/postgresql/compare/v0.0.3...HEAD
[0.0.3]: https://github.com/authnomicon/postgresql/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/authnomicon/postgresql/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/authnomicon/postgresql/releases/tag/v0.0.1
