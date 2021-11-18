---
id: eslint
title: ESLint usage
---

It is recommended to use a dependency array with all Moti Interaction hooks, just like `useMemo` and `useCallback`.

To enforce this with your ESLint plugin, you can use the `additionalHooks` field in your ESLint config:

```json
{
  "rules": {
    // ...
    "react-hooks/exhaustive-deps": [
      "error",
      {
        "additionalHooks": "(useMotiPressableTransition|useMotiPressable|useMotiPressables|useMotiPressableAnimatedProps|useInterpolateMotiPressable)"
      }
    ]
  }
}
```

This assumes you've already installed the `react-hooks` eslint [plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks).
