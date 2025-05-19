// utils/getPriceIndex.ts
export function getPriceIndexFromSelected(
    selectedList: number | null,
    percent: { number: number }[]
  ): number {
    if (!selectedList || !Array.isArray(percent)) return 0
  
    const indexInPercent = percent.findIndex(p => p.number === selectedList)
    if (indexInPercent === -1) return 0
  
    return indexInPercent + 1 // +1 porque el primer precio es el base
  }
  