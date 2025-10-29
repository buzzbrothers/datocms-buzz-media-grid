export type TConfig = {
  pluginName?: string
  linkModels?: {
    label: string
    value: string
  }[]
  gridModels?: {
    label: string
    value: string
  }[]
  textStyles?: string
  fieldsInWhichAllowCustomStyles: string[]
}
