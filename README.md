# Disclaimer:
**I did not create and do not maintain this project!** *(at least not at the moment)*

This project belongs to [jaysoo](https://github.com/jaysoo/react-native-prompt) and is a fork from [lightman73's](https://github.com/lightman73/react-native-prompt) fork that includes changes to remove the prop-types error.
This fork is only and only because the original package is not maintained anymore and i wanted to publish it to use it with my projects.

Feel free to use it, and if the community wants the package to be maintained from this repo, it's all fine by me.

[![](https://img.shields.io/npm/v/@phil-r/react-native-prompt.svg?style=flat-square)](https://www.npmjs.com/package/@phil-r/react-native-prompt)

# react-native-prompt

A cross-platform prompt component for React Native.

## Installation

```
$ npm install @phil-r/react-native-prompt --save
```

## Demo

| iOS | Android |
| --- | ------- |
| ![](./demo.ios.gif) | ![](./demo.android.gif) |

## Basic Usage

```js
import Prompt from '@phil-r/react-native-prompt';

// Inside render()
<Prompt
    title="Say something"
    placeholder="Start typing"
    defaultValue="Hello"
    visible={ this.state.promptVisible }
    onCancel={ () => this.setState({
      promptVisible: false,
      message: "You cancelled"
    }) }
    onSubmit={ (value) => this.setState({
      promptVisible: false,
      message: `You said "${value}"`
    }) }/>
```

Please refer to the full working example [here](./PromptExample/PromptExample.js).

## API

Props:

- `visible` (boolean) -- When `true`, the prompt is displayed, closes otherwise
- `title` (string, required) -- The title text of the prompt
- `placeholder` (string) -- The placeholder text of the prompt
- `defaultValue` (string) -- The default value of the prompt
- `onCancel` (function, required) -- Function that is called when user cancels prompt
- `onSubmit` (function, required) -- Function that is called with user's value when they submit
- `submitText` (string) -- The string that is displayed on the submit button (defaults to "OK")
- `cancelText` (string) -- The string that is displayed on the cancel button (defaults to "Cancel")
- `onChangeText` (function) -- Function that is called with user input when it changes.
- `textInputProps` (Object) -- Additional props on the input element
- `limit` (number) -- limit the length of the text

## Testing

Install dev modules:

```
npm install
```

### Run tests

```
npm test
```

## Changelog

### 1.0.7

- Add limit support

### 1.0.6

- Deprecation warnings fix

### 1.0.3

- Added Keyboard return as a submit (Thanks https://github.com/aquacash5)
- Compatibility problems with React >= 15.5

### 1.0.0

- Updates `value` when `defaultValue` changes. (Thanks https://github.com/vessp)
- Removes unnecessary `flex: 1` style. (Thanks https://github.com/stevehollaar)

### 0.18.6

- Adds `textInputProps` to allow additional props to be passed to the input element. Thanks @yueshuaijie!

### 0.18.5

- Fixed compatibility with React Native 0.27.2 (thanks [@sibelius](https://github.com/sibelius) and [@tonyxiao](https://github.com/tonyxiao)!)
