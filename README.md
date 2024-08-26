# iTELL Turndown

This is an HTML to Markdown converter for iTELL. It is based on [htmd](https://github.com/letmutex/htmd/tree/main) and [turndown](https://github.com/mixmark-io/turndown).

# Usage

1. `yarn` to install dependencies.
2. `yarn build` to build the project. This will generate an `itell-turndown.[darwin|win32|linux].node` file in the project root.
3. `yarn test` to run tests with [ava](https://github.com/avajs/ava).

Optionally, run benchmarks with `yarn bench`.

## Development requirements

-   Install the latest `Rust` with [rustup](https://rustup.rs/)
-   Install `Node.js`
-   Install `yarn`

## TODO: Release Package Instructions

Ensure you have set your **NPM_TOKEN** in the `GitHub` project setting.

In `Settings -> Secrets`, add **NPM_TOKEN** into it.

When you want to release the package:

```
npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]

git push
```

GitHub actions will do the rest job for you.
