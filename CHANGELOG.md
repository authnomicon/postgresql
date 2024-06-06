# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added

- Added protected `PostgreSQLUserDirectory#_toRow()` function, which can be
overridden by subclasses to extend rows with additional columns prior to
inserting into database.
- Added `PostgreSQLAccessTokenService` component.
- Added `PostgreSQLAuthorizationCodeService` component.

### Changed
- Added `grant` argument to `PostgreSQLGrantService#create()`.

### Fixed
- `PostgreSQLGrantService#find()` yields grant object when found.
- `PostgreSQLGrantService#create()` is now implemented.

## [0.0.7] - 2024-05-31
### Changed
- Renamed `client.webOrigins` to `client.originURIs` and correctly read value
from database.

### Fixed
- Fixed error where `FederatedIDStore` would fail to be created due to
underlying `users` table not existing in database.

## [0.0.6] - 2024-05-28
### Added
- Parsing nickname for user object yielded from `PostgreSQLUserDirectory`.
- Parsing photos for user object yielded from `PostgreSQLUserDirectory`.
- Parsing URLs for user object yielded from `PostgreSQLUserDirectory`.
- Parsing phone numbers for user object yielded from `PostgreSQLUserDirectory`.
- Parsing gender for user object yielded from `PostgreSQLUserDirectory`.
- Parsing addresses for user object yielded from `PostgreSQLUserDirectory`.
- Inserting middle name into database.
- Inserting honorific prefix into database.
- Inserting honorific suffix into database.
- Inserting nickname into database.
- Inserting photos into database.
- Inserting URLs into database.
- Inserting gender into database.
- Inserting addresses into database.
- Complete user object yielded from `PostgreSQLPasswordStore`.
- Additional columns to `clients` SQL schema to support [OAuth 2.0 Dynamic Client Registration](https://datatracker.ietf.org/doc/html/rfc7591),
[OpenID Connect Dynamic Client Registration](https://openid.net/specs/openid-connect-registration-1_0.html),
[OpenID Connect RP-Initiated Logout](https://openid.net/specs/openid-connect-rpinitiated-1_0.html),
[OpenID Connect Front-Channel Logout](https://openid.net/specs/openid-connect-frontchannel-1_0.html),
[OpenID Connect Back-Channel Logout](https://openid.net/specs/openid-connect-backchannel-1_0.html),
[JWT-Secured Authorization Request (JAR)](https://www.rfc-editor.org/rfc/rfc9101.html),
[Pushed Authorization Requests (PAR)](https://www.rfc-editor.org/rfc/rfc9126.html),
[Rich Authorization Requests (RAR)](https://www.rfc-editor.org/rfc/rfc9396.html), and
[Demonstrating Proof of Posession (DPoP)](https://www.rfc-editor.org/rfc/rfc9449.html)

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

[Unreleased]: https://github.com/authnomicon/postgresql/compare/v0.0.7...HEAD
[0.0.7]: https://github.com/authnomicon/postgresql/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/authnomicon/postgresql/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/authnomicon/postgresql/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/authnomicon/postgresql/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/authnomicon/postgresql/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/authnomicon/postgresql/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/authnomicon/postgresql/releases/tag/v0.0.1
