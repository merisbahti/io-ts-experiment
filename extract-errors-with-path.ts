import { Errors } from 'io-ts'

const extractErrorsWithPath = (topObjectName: string, errors: Errors) => {
  return errors.map((error) => {
    const context = error.context
    const path = context.reduce((acc, context) => {
      if (
        context.key === '' ||
        // @ts-ignore
        context.type._tag === 'UnionType' ||
        // @ts-ignore
        context.type._tag === 'IntersectionType'
      )
        return acc
      return `${acc}.${context.key}`
    }, topObjectName)
    const lastContext = context[context.length - 1]
    return { path, expected: lastContext.type.name, found: lastContext.actual }
  })
}

export default extractErrorsWithPath
