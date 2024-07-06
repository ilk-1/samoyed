# samoyed

A tool to improve the experience of git hooks.

[![npm Package](https://img.shields.io/npm/v/@ilk-1/samoyed.svg)](https://www.npmjs.org/package/@ilk-1/samoyed)
[![License](https://img.shields.io/npm/l/@ilk-1/samoyed.svg)](https://github.com/ilk-1/samoyed/blob/main/LICENSE)
[![downloads per month](https://img.shields.io/npm/dm/@ilk-1/samoyed.svg)](https://www.npmjs.org/package/@ilk-1/samoyed)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Set up

- install the npm package `npm install @ilk-1/samoyed`
- run the script to initialize samoyed `npx samoyed`

## Introduction

The samoyed support `pre-commit` and `commit-msg`. When you run `git commit -m "xxxxxx"`, the hook will run the `.samoyed/main.mjs` and mark it's type. This js-file will check the `.samoyedrc.json` to collect commands for running.

```ts
interface SamoyedConfig {
    "pre-commit": Array<{
        scope: string;
        commands: string[];
    }>;
    "commit-msg": Array<{
        scope: string;
        commands: string[];
    }>
}
```

## Detail

The samoyed use RegExp to determine which command will be run. So the scope is actually a regexp string.
