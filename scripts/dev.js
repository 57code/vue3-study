/*
Run Rollup in watch mode for development.

To specific the package to watch, simply pass its name and the desired build
formats to watch (defaults to "global"):

```
# name supports fuzzy match. will watch all packages with name containing "dom"
nr dev dom

# specify the format to output
nr dev core --formats cjs

# Can also drop all __DEV__ blocks with:
__DEV__=false nr dev
```
*/

// 执行命令行工具的库
const execa = require('execa')
const { fuzzyMatchTarget } = require('./utils')
// 获取命令行参数
const args = require('minimist')(process.argv.slice(2))
// 设置打包目标，默认什么也不传会打包vue
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
// 设置打包格式 --formats xxx  -f xxx
const formats = args.formats || args.f
// 设置映射文件 --sourcemap -s
const sourceMap = args.sourcemap || args.s
const commit = execa.sync('git', ['rev-parse', 'HEAD']).stdout.slice(0, 7)

// 执行rollup
execa(
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`,
      sourceMap ? `SOURCE_MAP:true` : ``
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
