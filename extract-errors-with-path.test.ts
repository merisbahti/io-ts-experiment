import * as io from 'io-ts'
import extractErrorsWithPath from './extract-errors-with-path'

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
