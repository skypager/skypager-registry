import { hideProperty as hide } from './util'
import SimpleDirectory from './simple'
import get from 'lodash/get'
import query from './query'

/**
 * The Directory is a searchable registry
 */
export class Directory extends SimpleDirectory {
    /**
   * Create a new Simple Registry
   * @param  {String} name   The name of this registry
   * @param  {Object} options =             {} Options
   * @param  {Function} options.init a function which will be called with the registry after it is initialize.
   * @param  {Function} options.fallback called whenever an invalid lookup request returns
   *
   * @param {String} route an express or path-to-regexp style route which turns the id into metadata
   * @return {SimpleRegistry}        The SimpleRegistry
   */
  constructor(name, options = {}) {
    super(name, options)

    if (!options.route) {
      options.route = ':id(.*)'
    }

    this.attach('metadata', {
      fallback: function(id) {
        return {
          notFound: true,
          id
        }
      }
    })

    hide(this, 'route', this.createRoute(options.route))
  }

  search (params = {}) {
    const reg = this

    const items = this.metadata.available
      .map((id) => reg.meta(id))
      .filter(r => !r.notFound)

    return query(items, params)
  }

  meta(id, defaultData = {}) {
    const result = get(this.metadata, id)

    return {
      ...defaultData,
      ...result || {},
      ...this.route(id) || {},
    }
  }

  register (id, fn, metadata = {}) {
    Object.assign(
      metadata,
      { registryId: id },
      ...this.route(id) || {},
    )

    this.registry.register(id, fn)
    this.metadata.register(
      id, (() => metadata)
    )

    return this
  }
}

export default Directory
