// 组件分类表 —— build-docs.mjs 与 localize-groups.mjs 共用的唯一事实来源。
//
// 两套名字各有用途:
//   slug  给 converter —— 它把 category 做 `[^a-z0-9]+` slug 化,中文会被清成空串、
//         分类直接失效,所以喂进 frontmatter 的必须是 ASCII。
//   label 给人看 —— 目录名与预览 HTML 首行的 @dsCard group,claude.ai/design 的
//         组件面板按它分组。build 之后由 localize-groups.mjs 换上。
export const GROUPS = {
  foundation: '基础组件',
  form: '表单组件',
  feedback: '反馈组件',
  display: '展示组件',
  navigation: '导航组件',
  business: '业务组件',
};

/** 组件 → [分类 slug, 源文档 basename(无扩展名);null = 本仓没有独立文档] */
export const COMPONENTS = {
  Avatar: ['foundation', 'avatar'],
  BlurLayer: ['foundation', 'blur-layer'],
  Button: ['foundation', 'button'],
  Chip: ['foundation', 'chip'],
  Icon: ['foundation', 'icons'],
  IconButton: ['foundation', 'icon-button'],
  Logo: ['foundation', 'logo'],
  StatusDot: ['foundation', 'status-dot'],
  Tag: ['foundation', 'tag'],
  Thumbnail: ['foundation', 'thumbnail'],
  ThemeProvider: ['foundation', null],

  Checkbox: ['form', 'checkbox'],
  Form: ['form', 'form'],
  FormGroup: ['form', 'form'],
  FormRow: ['form', 'form'],
  Input: ['form', 'input'],
  PasswordInput: ['form', 'password-input'],
  Radio: ['form', 'radio'],
  Search: ['form', 'search'],
  Segmented: ['form', null],
  Stepper: ['form', 'stepper'],
  Switch: ['form', 'switch'],
  Textarea: ['form', 'textarea'],

  ConfirmHost: ['feedback', 'confirm'],
  Empty: ['feedback', 'empty'],
  Pulse: ['feedback', 'pulse'],
  PulseDot: ['feedback', 'pulse'],
  Reveal: ['feedback', 'reveal'],
  Skeleton: ['feedback', 'skeleton'],
  Spinner: ['feedback', 'loading'],
  ToastHost: ['feedback', 'toast'],

  Card: ['display', 'card'],
  Carousel: ['display', 'carousel'],
  Cell: ['display', 'cell'],
  EntryCard: ['display', 'entry-card'],
  Grid: ['display', 'grid'],
  List: ['display', 'cell'],

  DrawerHeader: ['navigation', 'drawer-header'],
  NavBar: ['navigation', 'navbar'],
  TabBar: ['navigation', 'tabbar'],
  Tabs: ['navigation', 'tabs'],

  AvatarWithRing: ['business', 'avatar-with-ring'],
  GlassStats: ['business', 'glass-stats'],
  GradientWash: ['business', 'decorations'],
  RadialHalo: ['business', 'decorations'],
  ScreenBackdrop: ['business', 'decorations'],
  VersionPill: ['business', 'version-pill'],
};

/** 组件名 → 中文分类标签。 */
export const labelFor = (name) => GROUPS[COMPONENTS[name]?.[0]] ?? null;
