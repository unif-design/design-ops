// design-sync 的 bundle 入口:在 lib/module 之前落地 RN 全局,其余原样转出。
// 保持 ESM(而非 CJS entry)是为了让 esbuild 拿到完整的静态命名导出表 ——
// converter 的 export-evidence pass 依赖它来校验 cfg.provider 等名字。
import './rn-globals.cjs';
export * from '../lib/module/index.js';

// SafeAreaProvider 不是本包的导出,但 ToastHost 一类组件内部调 useSafeAreaInsets,
// 缺 provider 会直接抛 "No safe area value available"(design 仓 website 的 webpack
// 插件注释里记着同一个坑)。把它挂进 bundle,好让 cfg.provider 能在预览外层包一层。
export { SafeAreaProvider } from 'react-native-safe-area-context';
