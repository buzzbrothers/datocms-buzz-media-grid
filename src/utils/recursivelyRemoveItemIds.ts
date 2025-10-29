/**
 * Recursively removes the `itemId` property from an object. Useful for removing block IDs from presets.
 *
 * @param {object} item - The object to process.
 * @returns {object} A new object with all `itemId` properties removed.
 *
 * @example
 * const input = {
 *   body: {
 *     heading_level: {
 *       itemId: "UOPautTwRUChxRgvZVNrgg",
 *       itemTypeId: "TZdH_kDlTYabcvY9MJ-8Ig"
 *     },
 *     itemId: "ENhlkor8TPCb3639gKwZRA",
 *     itemTypeId: "ZyT7DXr4SFa3Z9Bl5Kqkmw"
 *   },
 *   itemId: "BBBMn-YPSu6dTcIAgdQIYQ",
 *   itemTypeId: "TIdkBsjCTFCyBbzIn9eecg"
 * };
 *
 * const result = removeItemId(input);
 * console.log(result);
 * // Output:
 * // {
 * //   body: {
 * //     heading_level: {
 * //       itemTypeId: "TZdH_kDlTYabcvY9MJ-8Ig"
 * //     },
 * //     itemTypeId: "ZyT7DXr4SFa3Z9Bl5Kqkmw"
 * //   },
 * //   itemTypeId: "TIdkBsjCTFCyBbzIn9eecg"
 * // }
 */

export const recursivelyRemoveItemIds = (item: object): object => {
  const processItem = (data: object | object[]): object | object[] => {
    if (Array.isArray(data)) {
      return data.map((element) => processItem(element))
    } else if (typeof data === 'object' && data !== null) {
      const { itemId, ...rest } = data as Record<string, unknown>
      return Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [
          key,
          Array.isArray(value) || (typeof value === 'object' && value !== null)
            ? processItem(value)
            : value
        ])
      )
    }
    return data
  }

  return processItem(item)
}
