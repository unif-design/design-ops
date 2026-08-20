// 把 lib/module(React Native)预打包成一个自包含的纯 Web ESM,供 design-sync 的
// converter 当 --entry 消费。
//
// 为什么需要这一步:claude.ai/design 跑在浏览器里,而本包的组件 import 'react-native'。
// converter 的 esbuild 没有 platform-resolution 的配置口子(resolveExtensions 拿不到
// .web.js,RN 的 Flow 深路径也没法置空),而 fork converter 的 lib/bundle.mjs 是被
// 明令禁止的 —— 它定义与 claude.ai/design 自检的输出契约。预打包把问题挡在 converter
// 之前:它拿到的是一个已经没有任何 RN 依赖的普通 ESM,走标准路径即可。
//
// 三条规则逐条对应 website/src/plugins/docusaurus-rnw/index.js 里被验证过的 webpack 配置,
// 那份配置是文档站在浏览器里渲染本包组件的现役方案:
//   resolve.extensions 前置 .web.*      → resolveExtensions
//   'react-native$': 'react-native-web' → rnAlias 的精确匹配
//   'react-native/Libraries': false     → rn-empty namespace
// 改这里之前先看那份 webpack 插件,两边必须保持同义。
import { build } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { statSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(HERE);
// 浏览器侧依赖树:website 装齐了 react-dom / react-native-web 与全部 8 个 RN peer,
// 仓库根那份是 native 侧的(没有 react-dom、没有 react-native-web)。
const NM = join(REPO, 'website/node_modules');
const OUT = join(HERE, 'web-dist/index.mjs');

const rnWeb = {
  name: 'rn-web',
  setup(b) {
    b.onResolve({ filter: /^react-native$/ }, () => ({
      path: join(NM, 'react-native-web/dist/index.js'),
    }));
    // fabric / codegen / TurboModule spec 只在 native runtime 执行;web 上置空,
    // 既避开 esbuild 读不懂的 Flow 语法,也避开 missing export 警告。
    b.onResolve({ filter: /^react-native\/(Libraries|src)\// }, (a) => ({
      path: a.path,
      namespace: 'rn-empty',
    }));
    b.onLoad({ filter: /.*/, namespace: 'rn-empty' }, () => ({
      contents: 'export default {};',
      loader: 'js',
    }));
  },
};

const result = await build({
  entryPoints: [join(HERE, 'web-entry.mjs')],
  outfile: OUT,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2020',
  nodePaths: [NM],
  // .web.* 必须排在前面,否则解析到 native 入口、运行期才崩。
  resolveExtensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js',
                      '.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs', '.json'],
  plugins: [rnWeb],
  // react 系留给 converter 去 external 成 window.React。
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  define: { 'process.env.NODE_ENV': '"development"' },
  logLevel: 'warning',
});

if (result.warnings.length) {
  for (const w of result.warnings) console.error('  ! ' + w.text);
}
console.error(`[web-entry] ${OUT} — ${(statSync(OUT).size / 1024).toFixed(0)}KB, ` +
              `${result.warnings.length} warnings`);
