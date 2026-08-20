import * as React from 'react';
import { View } from 'react-native';
import { BRAND_ORANGE, Logo } from '@unif/react-native-design';

/* Logo 的 source 由接入方提供(require 本地图或 {uri})。预览没有仓库图片可用,
   就地生成一张品牌色占位图 —— 颜色取自导出的 BRAND_ORANGE token,不写死 hex。
   用 base64 而非 utf8 形式的 data URI:后者在 CSS background-image 里还要再转义一层。 */
const brandMark = (color: string) => {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">` +
    `<rect width="128" height="128" fill="${color}"/>` +
    `<text x="64" y="92" font-family="Helvetica,Arial,sans-serif" font-size="76" ` +
    `font-weight="700" fill="#FFFFFF" text-anchor="middle">U</text></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

export const Sizes = () => {
  const uri = brandMark(BRAND_ORANGE);
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Logo source={{ uri }} size={32} accessibilityLabel="Unif" />
      <Logo source={{ uri }} size={48} accessibilityLabel="Unif" />
      <Logo source={{ uri }} size={64} accessibilityLabel="Unif" />
    </View>
  );
};

export const Rounding = () => {
  const uri = brandMark(BRAND_ORANGE);
  return (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Logo
        source={{ uri }}
        size={56}
        borderRadius={4}
        accessibilityLabel="直角"
      />
      <Logo source={{ uri }} size={56} accessibilityLabel="默认 squircle" />
      <Logo
        source={{ uri }}
        size={56}
        borderRadius={56}
        accessibilityLabel="满圆"
      />
    </View>
  );
};
