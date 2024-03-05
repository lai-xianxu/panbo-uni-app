// 跳转
export const routerPush = (
  path,
  params = {},
  openType = 'navigateTo' // 跳转方式 navigateTo | redirectT | reLaunc | switchTab
) => {
  if (openType == 'switchTab') {
    uni.switchTab({
      url: path,
    });
    return;
  }
  const paramsStr = encodeURIComponent(
    Object.entries(params)
      .map(([key, val]) => `${key}=${val}`)
      .join('&')
  );
  const url = paramsStr ? `${path}?${paramsStr}` : path;
  uni[openType]({ url });
};

// 返回
export const routerBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};
