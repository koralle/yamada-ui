import { isArray, isFunction, isObject, type Dict } from "./assertion"

export const omitObject = <T extends Dict, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> => {
  const result: Dict = {}

  Object.keys(obj).forEach((key) => {
    if (keys.includes(key as K)) return

    result[key] = obj[key]
  })

  return result as Omit<T, K>
}

export const merge = <T extends Dict>(
  target: any,
  source: any,
  mergeArray: boolean = false,
): T => {
  let result = Object.assign({}, target)

  if (isObject(source)) {
    if (isObject(target)) {
      for (const [sourceKey, sourceValue] of Object.entries(source)) {
        const targetValue: any = target[sourceKey]

        if (mergeArray && isArray(sourceValue) && isArray(targetValue)) {
          result[sourceKey] = targetValue.concat(...sourceValue)
        } else if (
          !isFunction(sourceValue) &&
          isObject(sourceValue) &&
          target.hasOwnProperty(sourceKey)
        ) {
          result[sourceKey] = merge(targetValue, sourceValue, mergeArray)
        } else {
          Object.assign(result, { [sourceKey]: sourceValue })
        }
      }
    } else {
      result = source
    }
  }

  return result as T
}
