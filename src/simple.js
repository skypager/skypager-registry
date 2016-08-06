import registry from './registry'
import route from './route'
import { hideProperty as hide, propertyUtils } from './util'
import { mapValues, get }  from 'lodash'

const { assign } = Object

export class SimpleRegistry {

  /**
   * Attach a registry to a host
   *
   * @example
   * 	SimpleRegistry.attach('components').to(host)
   */
  static attach(name, options = {}) {
    return {
      to (target) {
        registry(target, name, options)
        return get(target, name)
      }
    }
  }

  static create(name, options = {}) {
    return new this(name, options)
  }

  /**
   * Create a new Simple Registry
   * @param  {String} name   The name of this registry
   * @param  {Object} options =             {} Options
   * @param  {Function} options.init a function which will be called with the registry after it is initialize.
   * @param  {Function} options.fallback called whenever an invalid lookup request returns
   *
   * @return {SimpleRegistry}        The SimpleRegistry
   */
  constructor (name, options = {}) {
    assign(this, propertyUtils(this))

    this.name = name

    hide(this, 'options', {
      ...options,
      name,
    })

    hide(this, 'createRoute', route(options.routeOptions))

    this.attach('registry', {})

    if (typeof options.init === 'function') {
      options.init.call(this, this, options)
    }

  }

  attachAll (map) {
    const target = this

    return mapValues(map, (options, name) => (
      target.attach(name, options)
    ))
  }

  attach (name, options) {
    this.constructor.attach(name, options).to(this)
    return get(this, name)
  }

  /**
   * Register a component with the registry
   * @param  {[type]} componentId [description]
   * @param  {[type]} component   [description]
   * @return {[type]}             [description]
   */
  register (componentId, component) {
    return this.registry.register(
      componentId,
      () => component
    )
  }

  get available() {
    return this.registry.available
  }

  lookup (componentId) {
    const component = get(this.registry, componentId )
    return component || fallback.call(this, componentId)
  }

}

export default SimpleRegistry

function fallback (...lookupArgs) {
  const registry = this

  return get(
    registry.options,
    'fallback',
    () => lookupArgs.concat(registry)
  )
}
