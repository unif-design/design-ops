# 环境准备

跑同步之前要就位的三件事。装错版本会拖到 validate 阶段才报错,先对一遍省一轮。

## playwright:版本必须与本机缓存的 chromium 对上

渲染校验用 headless chromium。**缓存的 chromium build 号决定了该装哪个 playwright**,
版本对不上报 `browserType.launch: Executable doesn't exist`。

```sh
ls ~/Library/Caches/ms-playwright/          # 看 chromium-<build> 的 build 号
```

已知对应关系(2026-08 实测):

| chromium build | playwright |
|---|---|
| 1217 | 1.59.1 |
| 1228 | 1.61.1 |
| 1234 | 1.62.1 |

装的时候跳过浏览器下载,免得又拉 200MB:

```sh
cd .ds-sync && PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm i playwright@1.59.1
```

缓存里没有可用 build 时,才让它自己下:`npx playwright install chromium`。

## converter 依赖:别并发装

`/design-sync` 会把 converter 脚本 stage 到 `.ds-sync/` 并装 `esbuild` / `ts-morph` / `@types/react`。

**同一个 `node_modules` 上不要同时跑两个 `npm i`** —— 两个 npm 进程会互相清目录,
后完成的那个把整个 `node_modules` 换掉,表现为 `Cannot find module '@ts-morph/common'`。
后台跑了一个就等它结束,别再补一个前台的。

## 软链:localize-groups 要用 converter 的哈希函数

`localize-groups.mjs` 会 `import '../.ds-sync/lib/sync-hashes.mjs'` 重算 `renderHashes` 与 `auxSha`。
`.ds-sync/` 由 `/design-sync` stage,所以**先跑一次 converter 再跑归位脚本**,顺序不能反。

脚本若要用裸 import 解析 converter 的依赖,补一条软链(gitignore,每个克隆各建一次):

```sh
ln -sfn ../.ds-sync/node_modules .design-sync/node_modules
```

## node_modules 指向

`--node-modules` 一律给 `website/node_modules`:

| | react-dom | react-native-web | 8 个 RN peer |
|---|---|---|---|
| 仓库根 `node_modules` | ✗ | ✗ | ✓(native 侧) |
| `website/node_modules` | ✓ | ✓ | ✓(浏览器侧) |

两边的 RN 库版本必须一致,`react-native-design` 自己的
`scripts/check-shared-dependencies.test.js` 守这条。若两边漂移,同步出去的组件行为会与 App 里的不一致。
