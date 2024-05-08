module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:vue/vue3-essential', 'prettier', 'plugin:prettier/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: '@typescript-eslint/parser',
        project: ['./tsconfig.json'],
        extraFileExtensions: ['.vue'],
    },
    plugins: ['vue'],
    rules: {
        'vue/require-default-prop': 'off',
        'no-debugger': 'off',
        'vue/multi-word-component-names': 'off',
    },
}
