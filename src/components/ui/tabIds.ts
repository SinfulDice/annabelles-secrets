/** Ids linking a tab to its panel (aria-controls / aria-labelledby). */
export const tabIds = (prefix: string, id: string) => ({
  tab: `${prefix}-tab-${id}`,
  panel: `${prefix}-panel-${id}`,
})
