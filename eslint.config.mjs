import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default withNuxt(
  {
    ignores: ['.claude/**']
  },
  eslintConfigPrettier
)
