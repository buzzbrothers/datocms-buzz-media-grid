// @ts-nocheck

import type { RenderFieldExtensionCtx } from 'datocms-plugin-sdk'
import {
  connect,
  IntentCtx,
  RenderManualFieldExtensionConfigScreenCtx
} from 'datocms-plugin-sdk'
import 'datocms-react-ui/styles.css'
import Config from './components/config/config.js'
import MediaGridConfigScreen from './components/mediaGrid/mediaGridConfigScreen.js'
import MediaGridField from './components/mediaGrid/mediaGridField.js'
import './css/index.css'
import { render } from './utils/render.js'

connect({
  customBlockStylesForStructuredTextField(field: Field, ctx: FieldIntentCtx) {
    const { fieldsInWhichAllowCustomStyles } = ctx.plugin.attributes.parameters

    if (!fieldsInWhichAllowCustomStyles.includes(field.attributes.api_key)) {
      console.log(
        '⚠️ No custom styles allowed for this field',
        field.attributes.api_key
      )
      return []
    }

    return ctx.plugin.attributes?.parameters?.textStyles ?? []
  },
  manualFieldExtensions(ctx: IntentCtx) {
    return [
      {
        id: 'mediaGrid',
        name: 'Media Grid',
        type: 'editor',
        fieldTypes: ['json'],
        configurable: true
      }
    ]
  },
  renderFieldAddon: (
    fieldExtensionId: string,
    ctx: RenderFieldExtensionCtx
  ) => {
    // switch (fieldExtensionId) {
    //   case 'presets':
    //     return render(<PresetsField ctx={ctx} />)
    // }
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'mediaGrid':
        return render(<MediaGridField ctx={ctx} />)
    }
  },
  renderManualFieldExtensionConfigScreen(
    fieldExtensionId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx
  ) {
    switch (fieldExtensionId) {
      case 'mediaGrid':
        return render(<MediaGridConfigScreen ctx={ctx} />)
    }
  },
  renderConfigScreen(ctx) {
    return render(<Config ctx={ctx} />)
  }
})
