// @ts-nocheck

import { get } from '@blackbyte/sugar/object'
import { uniqid } from '@blackbyte/sugar/string'
import { buildClient } from '@datocms/cma-client-browser'
import { Canvas } from 'datocms-react-ui'
import { createRef, useRef, useState } from 'react'
import DeleteButton from '../ui/deleteButton/deleteButton'
import './mediaGrid.css'
import { TMediaGrid, TMediaGridArea } from './mediaGrid.type'

export default function MediaGridField({ ctx }) {
  const currentValueRaw = get(ctx.formValues, ctx.fieldPath) ?? '{}'
  const grid = JSON.parse(currentValueRaw) as TMediaGrid
  const locale = ctx.locale || 'en'
  const pluginName = ctx.plugin.attributes?.parameters?.pluginName
  const gridModels = ctx.plugin.attributes?.parameters?.gridModels ?? []
  const apiToken = ctx.currentUserAccessToken

  const $root = createRef<HTMLDivElement>()

  const isMounted = useRef(false)
  const isPointerDown = useRef(false)

  const client = buildClient({ apiToken, environment: ctx.environment })
  const setParameterValue = (parameterId: string, newValue: any) => {
    if (grid[parameterId] === newValue) {
      return
    }

    // set then new value
    grid[parameterId] = newValue
    ctx.setFieldValue(ctx.fieldPath, JSON.stringify(grid))
  }

  const [columns, setColumns] = useState(
    grid.columns || ctx.parameters.columns || 6
  )
  const [rows, setRows] = useState(grid.rows || ctx.parameters.rows || 6)
  const [selecting, setSelecting] = useState(false)
  const [areas, setAreas] = useState<TMediaGridArea[]>(grid.areas || [])
  const [startArea, setStartArea] = useState<[number, number] | null>(null)
  const [endArea, setEndArea] = useState<[number, number] | null>(null)

  // set non updatable parameters only once
  setParameterValue('columns', columns)
  setParameterValue('rows', rows)

  const addArea = (start: [number, number], end: [number, number]) => {
    const newAreas = [...(areas ?? [])]
    newAreas.push({
      id: uniqid(),
      position: [
        Math.min(start[0], end[0]),
        Math.min(start[1], end[1]),
        Math.max(start[0], end[0]),
        Math.max(start[1], end[1])
      ],
      content: null
    })
    setAreas(newAreas)
    setParameterValue('areas', newAreas)
  }

  const getAreaById = (id: string): TMediaGridArea | null => {
    for (let area of areas) {
      if (area.id === id) {
        return area
      }
    }
    return null
  }

  const onGridCellPointerDown = (e: MouseEvent) => {
    if (!e.target.classList.contains('media-grid-field_cell')) {
      return
    }

    e.preventDefault

    const $cell = e.target as HTMLElement
    const cellPosition = getCellPosition($cell)

    setSelecting(true)
    setStartArea(cellPosition)
  }

  const onGridCellPointerUp = (e: PointerEvent) => {
    e.preventDefault

    addArea(startArea, endArea)

    setSelecting(false)
    setStartArea(null)
    setEndArea(null)
  }

  const getCellPosition = ($cell: HTMLElement): [number, number] => {
    const index = Array.from(
      $root.current.querySelectorAll('.media-grid-field_cell')
    ).indexOf($cell)

    const row = Math.floor(index / columns)
    const column = index % columns
    return [row, column]
  }

  const onPointerEnter = (e: PointerEvent) => {
    if (!selecting) {
      return
    }

    // get the cell position in the grid
    const $cell = e.target as HTMLElement
    const cellPosition = getCellPosition($cell)

    // if the is not already in an area, set it
    if (getArea(cellPosition[0], cellPosition[1]) !== -1) {
      return
    }

    // set the end area
    setEndArea(cellPosition)
  }

  const isInSelectingArea = (row: number, column: number): boolean => {
    if (!startArea || !endArea) {
      return false
    }

    const startRow = Math.min(startArea[0], endArea[0])
    const endRow = Math.max(startArea[0], endArea[0])
    const startCol = Math.min(startArea[1], endArea[1])
    const endCol = Math.max(startArea[1], endArea[1])

    return (
      row >= startRow && row <= endRow && column >= startCol && column <= endCol
    )
  }

  const getArea = (row: number, column: number): number => {
    for (let i in areas) {
      const area = areas[i]
      const [startRow, startCol, endRow, endCol] = area.position
      if (
        row >= startRow &&
        row <= endRow &&
        column >= startCol &&
        column <= endCol
      ) {
        return parseInt(i)
      }
    }
    return -1
  }

  const deleteContent = (area: TMediaGridArea) => {
    area.content = null
    const newAreas = [...areas]
    setAreas(newAreas)
    setParameterValue('areas', newAreas)
  }

  const deleteArea = (area: TMediaGridArea) => {
    const newAreas = areas.filter((a) => a.id !== area.id)
    setAreas(newAreas)
    setParameterValue('areas', newAreas)
  }

  return (
    <Canvas ctx={ctx}>
      <div
        className={`media-grid-field ${selecting ? '-selecting' : ''}`}
        ref={$root}
      >
        <div className="media-grid-field_grid-container">
          <div
            className="media-grid-field_grid"
            onPointerDown={onGridCellPointerDown}
            onPointerUp={onGridCellPointerUp}
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
          >
            {[...Array(rows * columns)].map((_, index) => (
              <div
                key={index}
                onPointerEnter={onPointerEnter}
                className={`media-grid-field_cell ${
                  getArea(Math.floor(index / columns), index % columns) !== -1
                    ? '-occupied'
                    : ''
                } ${
                  isInSelectingArea(
                    Math.floor(index / columns),
                    index % columns
                  )
                    ? '-in-selection'
                    : ''
                }`}
              ></div>
            ))}
          </div>

          <div
            className="media-grid-field_areas"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`
            }}
          >
            {areas.map((area, i) => (
              <div
                key={i}
                className="media-grid-field_area"
                style={{
                  gridColumnStart: area.position[1] + 1,
                  gridColumnEnd: area.position[3] + 2,
                  gridRowStart: area.position[0] + 1,
                  gridRowEnd: area.position[2] + 2
                }}
              >
                <div className="media-grid-field_area-controls">
                  {area.content && (
                    <DeleteButton
                      className="media-grid-field_area-delete-button"
                      label="Delete content"
                      onConfirm={() => {
                        deleteContent(area)
                      }}
                    />
                  )}
                  {!area.content && (
                    <DeleteButton
                      className="media-grid-field_area-delete-button"
                      label="Delete area"
                      onConfirm={() => {
                        deleteArea(area)
                      }}
                    />
                  )}
                </div>

                {!area.content && (
                  <button
                    className="media-grid-field_area-select-content-button"
                    onClick={async () => {
                      const upload = await ctx.selectUpload({ multiple: false })
                      area.content = {
                        type: upload.attributes.mime_type?.startsWith('video/')
                          ? 'video'
                          : 'image',
                        url: upload.attributes.url
                      }
                      const newAreas = [...areas]
                      newAreas[i] = area
                      setAreas(newAreas)
                      setParameterValue('areas', newAreas)
                    }}
                  >
                    Select content
                  </button>
                )}
                {area.content && area.content.type === 'image' && (
                  <img
                    className="media-grid-field_area-image"
                    src={area.content.url}
                  />
                )}
                {area.content && area.content.type === 'video' && (
                  <video
                    className="media-grid-field_area-video"
                    src={area.content.url}
                    loop
                    muted
                    playsInline
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Canvas>
  )
}
