import * as io from 'io-ts'
import extractErrorsWithPath from './extract-errors-with-path'
import * as O from 'optics-ts'

type Person = {
  name: string
  friends: Person[]
}

const friendsNames = O.optic<Person>()
  .prop('friends')
  .elems()
  .prop('name')

describe('lens/filter', () => {
  type Source = { bar: string }
  const source: Source[] = [{ bar: 'baz' }, { bar: 'quux' }, { bar: 'xyzzy' }]

  const traversal = O.optic_<Source[]>()
    .filter(item => item.bar !== 'quux')
    .elems()
    .prop('bar')
  type Focus = string[]

  it('collect', () => {
    const result = O.collect(traversal)(source)
    expect(result).toEqual(['baz', 'xyzzy'])
  })
})

type SubType = { waddup?: number; snaddup: string }
type Type = {
  hello: SubType[]
}

const value: Type = {
  hello: [{ waddup: 5, snaddup: 'hello2' }, { snaddup: 'hello' }],
}

const lens = O.optic<Type>().prop('hello')

describe('test lenses', () => {
  it('okay should work', () => {
    const gotten = O.get(lens)(value)
    expect(gotten).toBe(value.hello)
  })
  it('okay should work 2', () => {
    const gotten = O.collect(lens.elems())(value)
    expect(gotten).toBe(value.hello)
  })
})

const carCodec = io.type({
  name: io.string,
  wheels: io.literal(4),
})

const bikeCodec = io.type({
  name: io.string,
  wheels: io.literal(2),
})

const codec = io.type({
  name: io.string,
  vehicles: io.array(io.union([carCodec, bikeCodec])),
  someTuple: io.tuple([io.string, io.number]),
})

describe('extractErrorsWithPath', () => {
  const wrongTypeCarName = {
    name: 'heya',
    vehicles: [
      {
        name: 5 /* error here, should be string */,
        wheels: 4,
      },
    ],
    someTuple: [100 /* error here, should be string */, 5],
  }

  it('just works', () => {
    const result = codec.decode(wrongTypeCarName)
    if (result._tag === 'Left') {
      const extracted = extractErrorsWithPath('wrongTypeCarName', result.left)
      expect(extracted).toStrictEqual([
        {
          path: 'wrongTypeCarName.vehicles.0.name',
          expected: 'string',
          found: 5,
        },
        {
          path: 'wrongTypeCarName.someTuple.0',
          expected: 'string',
          found: 100,
        },
      ])
    }
  })
})
