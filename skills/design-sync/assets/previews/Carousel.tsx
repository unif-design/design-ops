import * as React from 'react';
import { Text, View } from 'react-native';
import { Carousel, useColors } from '@unif/react-native-design';

const noop = () => {};

/* 不开 autoplay —— 预览是静态截图,自动轮播会让每次抓到的帧不一样。 */
export const Banners = () => {
  const c = useColors();
  const data = [
    { id: '1', title: '春季新品上市', bg: c.primary },
    { id: '2', title: '本月拜访冲刺', bg: c.info },
    { id: '3', title: '门店陈列规范', bg: c.success },
  ];
  return (
    <Carousel
      data={data}
      height={140}
      keyExtractor={(item) => item.id}
      showIndicator
      indicatorPosition="overlay-bottom-right"
      onPressItem={noop}
      getAccessibilityLabel={(item) => item.title}
      renderItem={({ item }) => (
        <View
          style={{
            flex: 1,
            backgroundColor: item.bg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: c.onPrimary, fontSize: 16, fontWeight: '600' }}>
            {item.title}
          </Text>
        </View>
      )}
    />
  );
};
