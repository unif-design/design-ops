// build 之后跑:把组件按 groups.mjs 归到中文分类目录,并同步所有引用了分组名的地方。
//
// 为什么不能只靠 converter 的 category:
//   1. 它把 category slug 成 ASCII,中文会被清空;
//   2. 只有当组件原分组是 general/misc 时才应用 category —— 像 List(源码在 Cell/ 下)
//      这类会保留源码目录名,分类分不干净。
// 所以分类由 frontmatter 的 ASCII slug 定,中文标签与最终归位在这里落地。
//
// 幂等:已经在正确位置的组件跳过;重复执行不会出错。
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTS, GROUPS, labelFor } from './groups.mjs';
import { auxShaFor, renderHashFor } from '../.ds-sync/lib/sync-hashes.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(dirname(HERE), process.argv[2] ?? 'ds-bundle');
const COMP = join(OUT, 'components');

// ── 1. 归位:components/<任意现有分组>/<Name>/ → components/<中文标签>/<Name>/ ──
const moved = [];
for (const group of readdirSync(COMP)) {
  const groupDir = join(COMP, group);
  for (const name of readdirSync(groupDir)) {
    const label = labelFor(name);
    if (!label) { console.error(`  ! 分类表里没有 ${name} —— 留在 ${group}/`); continue; }
    if (group === label) continue;
    const target = join(COMP, label);
    mkdirSync(target, { recursive: true });
    renameSync(join(groupDir, name), join(target, name));
    moved.push(`${name}: ${group} → ${label}`);
  }
}
// 清掉搬空的旧分组目录
for (const group of readdirSync(COMP)) {
  const d = join(COMP, group);
  if (readdirSync(d).length === 0) rmdirSync(d);
}

// ── 2. 预览 HTML 首行的 @dsCard group —— 组件面板按它分组 ──
let carded = 0;
for (const group of readdirSync(COMP)) {
  for (const name of readdirSync(join(COMP, group))) {
    const p = join(COMP, group, name, `${name}.html`);
    if (!existsSync(p)) continue;
    const html = readFileSync(p, 'utf8');
    const nl = html.indexOf('\n');
    const first = html.slice(0, nl);
    const next = first.replace(/group="[^"]*"/, `group="${group}"`);
    if (next !== first) { writeFileSync(p, next + html.slice(nl)); carded += 1; }
  }
}

// ── 3. .stories-map.json 的 group(哈希重算要靠它定位 HTML) ──
const mapPath = join(OUT, '.stories-map.json');
const smap = JSON.parse(readFileSync(mapPath, 'utf8'));
for (const c of smap.components) c.group = labelFor(c.name) ?? c.group;
writeFileSync(mapPath, JSON.stringify(smap, null, 2) + '\n');

// ── 4. _ds_sync.json:sourceHashes 的 key 是产物路径,renderHashes 重算 ──
const syncPath = join(OUT, '_ds_sync.json');
const sync = JSON.parse(readFileSync(syncPath, 'utf8'));
const groupOf = Object.fromEntries(smap.components.map((c) => [c.name, c.group]));
sync.sourceHashes = Object.fromEntries(
  Object.entries(sync.sourceHashes).map(([k, v]) => {
    const m = /^components\/[^/]+\/([^/]+)\/(.+)$/.exec(k);
    return m && groupOf[m[1]] ? [`components/${groupOf[m[1]]}/${m[1]}/${m[2]}`, v] : [k, v];
  }),
);
for (const c of smap.components) {
  sync.renderHashes[c.name] = renderHashFor(OUT, c, { srcSha: c.srcSha ?? undefined });
}
writeFileSync(syncPath, JSON.stringify(sync, null, 2) + '\n');

// ── 5. README:英文技术章节改中文 + 按新分类重写组件索引 ──
// 顶部的中文约定由 cfg.readmeHeader 拼进来,这里处理 converter 自己生成的部分。
const readmePath = join(OUT, 'README.md');
let readme = readFileSync(readmePath, 'utf8');

// Loading 章节里的 provider 片段是按 cfg.provider 生成的,原样保留。
const providerSnippet = /<SafeAreaProvider[\s\S]*?<\/SafeAreaProvider>/.exec(readme)?.[0] ?? '';
const zhSections = `## 文件位置

- \`_ds_bundle.js\` — 项目根的整包 bundle,把全部组件挂到 \`window.UnifDesign\`。首行是 \`/* @ds-bundle: … */\` 元信息。
- \`styles.css\` — 唯一的样式入口。本设计系统是 React Native 的 CSS-in-JS,组件样式在运行时注入,只需 link 这一个文件。
- \`components/<分类>/<组件名>/\` — \`.prompt.md\`(中文 API 表 + 用法示例)、\`.d.ts\`(类型契约)、\`.html\`(变体预览)。
- \`guidelines/\` — 设计系统自带的规范文档(设计原则 / 语气 / 禁忌 / 间距圆角阴影 / 字体 / 动效),见 \`guidelines/index.md\`。**做整屏布局前先读**。

查某个具体组件:\`read_file("components/<分类>/<组件名>/<组件名>.prompt.md")\`。

## 加载方式

在页面里加这两行(React 需先就位):

\`\`\`html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
\`\`\`

组件随后从 \`window.UnifDesign.*\` 取用。挂到独立的子节点(如 \`<div id="ds-root">\`),
不要挂在宿主页面自己的 React 根上,避免两棵树冲突:

\`\`\`jsx
const { Button } = window.UnifDesign;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<Button label="提交" onPress={fn} />);
\`\`\`

外层必须包 provider —— 多数组件从 context 读主题与安全区:

\`\`\`jsx
${providerSnippet}
\`\`\`

## 设计令牌

本设计系统**不产出 CSS 自定义属性** —— 它是 React Native 的 CSS-in-JS,样式在运行时计算并注入。
取值请用 \`useColors()\` 以及 \`space\` / \`radius\` / \`type\` / \`fw\` 等 token 导出,
完整词汇表见本文顶部的「样式写法」。

`;
const head = readme.slice(0, readme.indexOf('## Where things are')) + zhSections;
const byGroup = new Map();
for (const c of smap.components) {
  if (!byGroup.has(c.group)) byGroup.set(c.group, []);
  byGroup.get(c.group).push(c.name);
}
const order = Object.values(GROUPS);
const sections = [...byGroup.entries()]
  .sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]))
  .map(([g, names]) => `### ${g}\n\n${names.sort().map((n) => `- \`${n}\` — \`components/${g}/${n}/${n}.prompt.md\``).join('\n')}`)
  .join('\n\n');
readme = `${head}## 组件索引\n\n共 ${smap.components.length} 个组件,分 ${byGroup.size} 类。每个组件的 API 与用法见各自的 \`.prompt.md\`。\n\n${sections}\n`;
writeFileSync(readmePath, readme);
// README 变了,锚点里的 auxSha 要跟着更新,否则 re-sync 的上传 diff 会错判。
sync.auxSha = auxShaFor(OUT);
writeFileSync(syncPath, JSON.stringify(sync, null, 2) + '\n');

console.error(`[groups] 归位 ${moved.length} 个组件,改写 ${carded} 个 @dsCard,分类:${[...byGroup.keys()].join(' / ')}`);
if (moved.length) for (const m of moved) console.error(`         ${m}`);
