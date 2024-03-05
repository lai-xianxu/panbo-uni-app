// get请求
export const get = (params, loading = false) => {
  return uni.$uv.http.get('/get', {
    params,
    custom: { loading },
  });
};

// 密码登录
export const appPassLogin = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/passLogin', params, {
    custom: { loading, skipToken: true },
  });
};

// 手机验证码登录
export const appPhoneLogin = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/phoneLogin', params, {
    custom: { loading, skipToken: true },
  });
};

// 手机号手势登录
export const appGestureLogin = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/gestureLogin', params, {
    custom: { loading, skipToken: true },
  });
};

// 用户注册
export const appRegister = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/appRegister', params, {
    custom: { loading, skipToken: true },
  });
};

// 短信发送
export const appSms = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/sms', params, {
    custom: { loading, skipToken: true },
  });
};

// 用户更改密码
export const appPasswordChange = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/passwordChange', params, {
    custom: { loading, skipToken: true },
  });
};

// 用户忘记密码
export const appVerification = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/phoneVerification', params, {
    custom: { loading, skipToken: true },
  });
};

// 修改用户消息
export const appUpdateUser = (params, loading = true) => {
  return uni.$uv.http.post('/jeecg-boot/app/updateUserById', params, {
    custom: { loading },
  });
};

// 保存手势密码
export const appSaveGesture = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/saveGesture', params, {
    custom: { loading, skipToken: true },
  });
};

// 查询当前用户消息
export const appGetUser = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/app/getUser', {
    params,
    custom: { loading },
  });
};

// 获取用户协议
export const appGetAgreement = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/app/appBanner/getAgreement', {
    params,
    custom: { loading, skipToken: true },
  });
};