import * as io from 'io-ts'
import extractErrorsWithPath from './extract-errors-with-path'

const jsonprint = (a: unknown) => JSON.stringify(a, null, 2)

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

const wrongTypeCarName: unknown = {
  name: 'heya',
  vehicles: [
    {
      name: 5,
      wheels: 4,
    },
  ],
  someTuple: [100, 5],
}

const result = codec.decode(wrongTypeCarName)
if (result._tag === 'Left') {
  const feedback = extractErrorsWithPath(result.left)
  console.log(jsonprint(feedback))
}

