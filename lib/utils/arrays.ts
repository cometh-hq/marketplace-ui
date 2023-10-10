/**
 * Given a separator and a list,
 * returns a new list with the separator between each item.
 *
 * useful for react components that need to render a list of items
 * with a separator component between each item.
 */
export const intercalate = <T>(
  separator: (index: number) => T,
  list: T[]
): T[] =>
  list
    .reduce((acc, item, index) => [...acc, item, separator(index)], [] as T[])
    .slice(0, -1)

  
export const getFilterArray = (filters: any, key: string) =>
  Array.isArray(filters[key])
    ? filters[key]
    : ([filters[key]].filter(Boolean) as string[])

export const getRandomArrayElement = (array: number[]) => {
  return array[Math.floor(Math.random() * array.length)]
}