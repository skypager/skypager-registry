import Directory from './directory'

/**
 Collection Registry

*/

export class CollectionRegistry extends Directory {
  constructor (name, options = {}) {
    if (typeof name === 'object' && name.collection) {
      options = {
        collection: name.collection
      }
    }

    if (!options.route && options.shallow) {
      options.route = ':group/:id(.*)'
    } else if (!options.route && !options.shallow) {
      options.route = ':group/:category/:id(.*)'
    }

    const collection = options.collection

    delete(options.collection)

    super(name, options)

    if (!collection || typeof collection !== 'object' || !collection.root || !collection.type) {
      throw(new Error('Invalid Collection Object Passed'))
    }

    this.hide('collection', collection)
  }
}
