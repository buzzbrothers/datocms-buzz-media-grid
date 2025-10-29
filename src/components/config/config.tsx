// @ts-nocheck
import { buildClient } from '@datocms/cma-client-browser'
import {
  Canvas
} from 'datocms-react-ui'
import { useEffect } from 'react'
import './config.css'
import { type TConfig } from './config.type'

let updateTimeout

export default function Config({ ctx }) {
  const parameters = (ctx.plugin.attributes.parameters ?? {}) as TConfig

  useEffect(() => {
    ;(async () => {
      const client = buildClient({ apiToken: ctx.currentUserAccessToken })
      const itemTypes = await client.itemTypes.list()
      const models: any = []
      itemTypes.forEach((itemType) => {
        models.push({ label: itemType.name, value: itemType.id })
      })
      setAvailableModels(models)
    })()
  }, [])

  function updateParameters(newParameters: Partial<TConfig>): void {
    clearTimeout(updateTimeout)
    updateTimeout = setTimeout(() => {
      ctx.updatePluginParameters({
        ...parameters,
        ...newParameters
      })
      ctx.notice('Config updated successfully!')
    })
  }

  return (
    <Canvas ctx={ctx}>
      <div className="config">
        <p>No configuration options available</p>
      </div>
    </Canvas>
  )
}
