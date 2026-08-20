// 给 47 个组件补上分类,并把 website/docs/components 的中文文档镜像成 converter 能吃的形态。
//
// 为什么要镜像而不是直接改仓库文档:category 只服务 design-sync,不该污染 Docusaurus 的
// frontmatter(它对未知字段有校验)。镜像目录是派生物,gitignore;本脚本与下面的映射表
// 才是事实来源,随仓库提交。
//
// 分类 slug 必须是 ASCII —— converter 用 `category.toLowerCase().replace(/[^a-z0-9]+/g,'-')`
// 生成目录名,中文会被整段清成空串、分类直接失效。界面上显示的中文标签由
// localize-groups.mjs 在 build 之后写进每个预览 HTML 首行的 @dsCard。
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(dirname(HERE), 'website/docs/components');
const OUT = join(HERE, 'docs');

import { COMPONENTS as MAP } from './groups.mjs';

/** 本仓没有独立文档的组件,就地补一段中文说明,免得 prompt.md 只剩 frontmatter。 */
const FALLBACK = {
  Segmented: `# Segmented 分段控件\n\n局部分段控件 —— pill 在 track 上,激活项是亮色 thumb。\nactive thumb 必须比 track 亮一档:shadow 只在亮色态显示,暗色态由 surface 明度差表达层级。\n\n\`size\` 默认 \`'md'\`(44pt 触控达标);\`'sm'\` 紧凑(28pt),给模型下拉等局促位用。\n`,
  ThemeProvider: `# ThemeProvider 主题容器\n\n设计系统的主题根。应用最外层包一次,内部组件通过 \`useColors()\` / \`useThemedStyles()\` / \`useShadow()\` 取当前主题的颜色与阴影 token。\n\n- \`forceScheme\` 强制 \`'light'\` / \`'dark'\`,覆盖系统外观;缺省跟随 \`useColorScheme()\`。\n- \`fontScale\` 应用级字号缩放倍数,默认 1;由接入方自持档位状态并传入。\n\n不包这一层时,取 token 的 hook 拿不到 context,组件会退化成无主题样式。\n`,
};

/** 去掉原 frontmatter,只留正文 —— 我们要自己写一份带 category 的。 */
const stripFrontmatter = (s) => s.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
/** 原 frontmatter 里的 title,用作镜像文档的标题回退。 */
const titleOf = (s) => /^title:\s*(.+)$/m.exec(/^---\r?\n([\s\S]*?)\r?\n---/.exec(s)?.[1] ?? '')?.[1]?.trim();

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const missing = [];
let written = 0;
for (const [name, [category, slug]] of Object.entries(MAP)) {
  let body;
  if (slug) {
    const candidates = [`${slug}.mdx`, `${slug}.md`];
    const hit = candidates.map((f) => join(SRC, f)).find((p) => existsSync(p));
    if (!hit) { missing.push(`${name} → ${slug}`); continue; }
    const raw = readFileSync(hit, 'utf8');
    const t = titleOf(raw);
    body = (t ? `# ${t}\n\n` : '') + stripFrontmatter(raw);
  } else {
    body = FALLBACK[name] ?? `# ${name}\n`;
  }
  writeFileSync(join(OUT, `${name}.md`), `---\ncategory: ${category}\n---\n\n${body}`);
  written += 1;
}

if (missing.length) {
  console.error(`  ! build-docs: 源文档缺失 —— ${missing.join(', ')}`);
}
console.error(`[docs] ${OUT} — ${written} 个组件文档,${new Set(Object.values(MAP).map((v) => v[0])).size} 个分类`);
