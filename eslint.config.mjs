import antfu from '@antfu/eslint-config'
// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    rules: {
      'style/space-before-function-paren': ['error', 'always'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      // 'brace-style': 'off',
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'vue/require-explicit-emits': 'off',
      'vue/block-order': ['error', {
        order: [['template', 'script'], 'style'],
      }],
      'vue/no-multiple-template-root': 'off',
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      // Disable semi for TypeScript
    },
  }),
)
