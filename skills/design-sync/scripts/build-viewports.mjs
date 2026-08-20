// 给全部组件配 iPhone 尺寸的预览画框,写进 cfg.overrides。
//
// 这是手机端设计系统:converter 默认的 900x700 桌面画框会把 NavBar / TabBar / Cell
// 这类全宽组件横向拉满,比例与真机完全不同 —— 设计 agent 照着这种卡片布局,产出的
// 原型比例就是错的。390 是 iPhone 14/15 的逻辑宽度。
//
// cardMode 一律 column:390 宽下网格排不开,一行一个场景才是手机上的真实堆叠方式。
// 高度按场景数分档 —— 截图按内容裁剪,给足即可,给太多会让面板里的卡片瘦长。
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMPONENTS } from './groups.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PREVIEWS = join(HERE, 'previews');
const CFG = join(HERE, 'config.json');

const WIDTH = 390;
const countExports = (name) => {
  const p = join(PREVIEWS, `${name}.tsx`);
  if (!existsSync(p)) return 0;
  return (readFileSync(p, 'utf8').match(/^export const /gm) ?? []).length;
};
// 没写预览的组件只有一块占位排版,给最矮的一档就够。
const heightFor = (n) => (n === 0 ? 360 : Math.min(280 + n * 150, 820));

const cfg = JSON.parse(readFileSync(CFG, 'utf8'));
const overrides = { ...(cfg.overrides ?? {}) };
for (const name of Object.keys(COMPONENTS)) {
  const n = countExports(name);
  overrides[name] = { ...(overrides[name] ?? {}), cardMode: 'column', viewport: `${WIDTH}x${heightFor(n)}` };
}
cfg.overrides = overrides;
writeFileSync(CFG, JSON.stringify(cfg, null, 2) + '\n');

const tally = {};
for (const [, o] of Object.entries(overrides)) tally[o.viewport] = (tally[o.viewport] ?? 0) + 1;
console.error(`[viewports] ${Object.keys(overrides).length} 个组件 → ` +
  Object.entries(tally).sort().map(([v, c]) => `${v}×${c}`).join('  '));
