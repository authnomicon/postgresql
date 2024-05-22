# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Parsing nickname for user object yielded from `PostgreSQLUserDirectory`.
- Parsing photos for user object yielded from `PostgreSQLUserDirectory`.
- Parsing URLs for user object yielded from `PostgreSQLUserDirectory`.
- Parsing phone numbers for user object yielded from `PostgreSQLUserDirectory`.
- Parsing gender for user object yielded from `PostgreSQLUserDirectory`.
- Additional columns to `clients` SQL schema to support [OAuth 2.0 Dynamic Client Registration Protocol](https://datatracker.ietf.org/doc/html/rfc7591).

### Changed
- Simplified SQL schema to have a single `plural` type for `photos`, `urls`,
`emails`, and `phone_numbers`, following the convention established by [Portable Contacts](https://datatracker.ietf.org/doc/html/draft-smarr-vcarddav-portable-contacts-00).
- Renamed `redirect_uris` column of `clients` table to `redirect_urls`.

### Fixed
- Values of `user.emails[].primary` and `user.emails[].verified` no longer undefined
when mapping from database.
- `user.emails` and `user.phoneNumbers` are correctly inserted into database.

## [0.0.5] - 2024-05-10
### Fixed
- Fixed `ENOENT` error that occurs when attempting to create `clients` table.

## [0.0.4] - 2024-05-10
### Changed
- Renamed `federated_credential` table to `federated_credentials`, following
a pluralized naming convention due to the fact that the `users` table must be
plural.
- Renamed `client` table to `clients`, following a pluralized naming convention
due to the fact that the `grants` table must be plural.

## [0.0.3] - 2024-05-08
### Fixed
- Fixed `ENOENT` error that occurs when attempting to create `grants` table.

## [0.0.2] - 2024-05-08
### Fixed
- Fixed "ReferenceError: fs is not defined" by `require()`'ing necessary
module.

## [0.0.1] - 2024-05-08

- Initial release.

[Unreleased]: https://github.com/authnomicon/postgresql/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/authnomicon/postgresql/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/authnomicon/postgresql/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/authnomicon/postgresql/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/authnomicon/postgresql/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/authnomicon/postgresql/releases/tag/v0.0.1
