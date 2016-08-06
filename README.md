# Skypager Registry

A Registry is a queryable directory of functions.

Registries can be used for a variety of purposes, such as dependency injection, asynchronous module loading using something like Webpack's `require.ensure` or `System.import` functionality, or for building a database of plugins or middlewares that can be dynamically required using different kinds of application logic at runtime.

## Installation

```
npm install skypager-registry --save
```

## Usage Examples

### Building a registry of React Components

```javascript
import registry from 'skypager-registry'
import glob from 'glob'
import { dirname, basename } from 'path'

const componentIndexes = (cwd, componentFolder='components') => {
  const filePaths = glob.sync(`${componentFolder}/*/index.js`, { cwd })

  return filePaths.map((path) => (
    [basename(dirname(path)), path]
  )
}

const components = registry({}, 'components')

componentIndexes.forEach([componentId, modulePath] => {
  components.register(componentId, () => {
    const component = require(modulePath)
    return component.default ? component.default : component
  })
})
```

## Other Examples

For people familiar with `react-native` for example, there is the `AppRegistry`

```javascript
import React, { Component } from 'react'
import { AppRegistry, View } from 'react-native'

const MyScreen = (props = {}) => (
  <View>Hello World</View>
)

AppRegistry.registerComponent('MyScreen', () => MyScreen)
```
