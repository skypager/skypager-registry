import SimpleRegistry from '../src/simple'

describe('SimpleRegistry', function() {
  it('can be created', function() {
    const registry = SimpleRegistry.create()

    registry.should.be.an('object')
    registry.should.have.property('options')
  })

  it('can attached multiple registries', function() {
    const gateway = {}
    SimpleRegistry.attach('alpha').to(gateway)
    SimpleRegistry.attach('bravo').to(gateway)

    gateway.should.have.property('alpha')
      .that.is.an('object')
      .that.has.property('register')

    gateway.should.have.property('bravo')
      .that.is.an('object')
      .that.has.property('register')
  })

  it('can register functions', function() {
    const registry = SimpleRegistry.create('stuff', {})
    registry.register('MyFunction', () => 1)
    registry.lookup('MyFunction')().should.equal(1)
  })

  it('can list what is available', function() {
    const registry = SimpleRegistry.create('stuff', {})
    registry.register('MyFunction', () => 1)
    registry.available.should.include('MyFunction')
  })

  it('can lookup functions', function() {
    const registry = SimpleRegistry.create('stuff', {})
    registry.register('MyFunction', () => 1)
    registry.lookup('MyFunction')().should.equal(1)
  })

  it('has a fallback option', function() {
    const registry = SimpleRegistry.create('stuff', {})
    registry.lookup('Invalid')().should.be.an('array')
  })
})
