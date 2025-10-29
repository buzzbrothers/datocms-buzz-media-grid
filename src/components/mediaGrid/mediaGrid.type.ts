export type TMediaGridParameter = {
  columns: number
  rows: number
}

export type TMediaGrid = {}

export type TMediaGridArea = {
  id: string
  position: [number, number, number, number]
  content: {
    type: 'video' | 'image'
    url: string
  }
}
