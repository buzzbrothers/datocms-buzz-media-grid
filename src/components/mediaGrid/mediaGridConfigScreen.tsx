// @ts-nocheck

import { Canvas, TextField } from 'datocms-react-ui'
import { useCallback, useState } from 'react'
import { TGridParameter } from './mediaGrid.type.js'

export default function MediaGridConfigScreen({ ctx }) {
  const [formValues, setFormValues] = useState<Partial<TGridParameter>>(
    ctx.parameters
  )
  const update = useCallback(
    (field, value) => {
      const newParameters = { ...formValues, [field]: value }
      setFormValues(newParameters)
      ctx.setParameters(newParameters)
    },
    [formValues, setFormValues, ctx.setParameters]
  )

  return (
    <Canvas ctx={ctx}>
      <TextField
        id="columns"
        name="columns"
        type="number"
        label="Default columns count"
        defaultValue={6}
        value={formValues.columns ?? 6}
        onChange={update.bind(null, 'columns')}
      />
      <TextField
        id="columns"
        name="columns"
        type="number"
        label="Default rows count"
        value={formValues.rows ?? 6}
        onChange={update.bind(null, 'rows')}
      />
    </Canvas>
  )
}
