// 我的投递记录
export const appMyDelivery = (params, loading = true) => {
  return uni.$uv.http.get(
    '/jeecg-boot/recruitment/pbResumeDelivery/myDelivery',
    {
      params,
      custom: { loading },
    }
  );
};

// 我的面试记录
export const appMyInterview = (params, loading = true) => {
  return uni.$uv.http.get(
    '/jeecg-boot/recruitment/pbResumeDelivery/myInterview',
    {
      params,
      custom: { loading },
    }
  );
};

// 查询银行卡
export const appPdUserCardList = (params, loading = true) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getPdUserCardList', {
    params,
    custom: { loading },
  });
};

// 绑定银行卡
export const appAddPdUserCard = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/sys/wagesDetail/addCard', params, {
    custom: { loading },
  });
};

// 绑定银行卡校验
export const appAddPdUserCardCheck = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/check', {
    params,
    custom: { loading },
  });
};

// 删除银行卡
export const appDeleteCard = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/deleteCard', {
    params,
    custom: { loading },
  });
};

// 删除银行卡
export const appDeleteCard2 = (params, loading = false) => {
  return uni.$uv.http.delete('/jeecg-boot/sys/wagesDetail/delete', params, {
    custom: { loading },
  });
};

// 银行字典
export const appGetDictItems = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/api/getDictItems', {
    params,
    custom: { loading },
  });
};

// 证件类型字典
export const appGetCardType = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getCardType', {
    params,
    custom: { loading },
  });
};

// 国家字典
export const appGetPdAreaCountryList = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getPdAreaCountryList', {
    params,
    custom: { loading },
  });
};

// 获取余额
export const appBalanceGet = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/balance/get', {
    params,
    custom: { loading },
  });
};

// 查询我的余额流水
export const appGetPbBalanceChangeDetailList = (params, loading = true) => {
  return uni.$uv.http.get(
    '/jeecg-boot/sys/wagesDetail/getPbBalanceChangeDetailList',
    {
      params,
      custom: { loading },
    }
  );
};

// 查询我的工资
export const appGetPdWagesDetailList = (params, loading = true) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getPdWagesDetailList', {
    params,
    custom: { loading },
  });
};

// 申请信用卡
export const appAddPdUserCardApply = (params, loading = false) => {
  return uni.$uv.http.post(
    '/jeecg-boot/sys/wagesDetail/addPdUserCardApply',
    params,
    {
      custom: { loading },
    }
  );
};

// 获取广告
export const appGetPdAdvertisementConfigurationList = (
  params,
  loading = false
) => {
  return uni.$uv.http.get(
    '/jeecg-boot/sys/wagesDetail/getPdAdvertisementConfigurationList',
    {
      params,
      custom: { loading },
    }
  );
};

// 上传文件
export const appUpload = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/sys/common/upload', params, {
    custom: { loading },
  });
};

// 实名验证
export const appAddSysUserDocument = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/sys/user/addSysUserDocument', params, {
    custom: { loading },
  });
};

// 获取支付信息
export const alipayApi = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/pay/pbAlipayInfo/appPay', params, {
    custom: { loading },
  });
};

// 获取本月工资
export const appGetMonthWages = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getMonthWages', {
    params,
    custom: { loading },
  });
};

// 获取我的合同
export const appGetPdContract = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getPdContract', {
    params,
    custom: { loading },
  });
};

// 调息管理-获取利率
export const appGetInterestRate = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/interest/pbInterestAdjustment/getInterestRate', params, {
    custom: { loading },
  });
};

// 提现到银行卡
export const appPbWithdrawalsApply = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/pbWithdrawalsApply/appAdd', params, {
    custom: { loading },
  });
};

// 新增定期信息
export const appPbRegularSave = (params, loading = true) => {
  return uni.$uv.http.post('/jeecg-boot/regular/save', params, {
    custom: { loading },
  });
};

// 获取app版本信息
export const appGetVersionInfo = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/app/version/info', {
    params,
    custom: { loading },
  });
};

// 获取app更新包
export const appGetVersionNew = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/app/version/new', {
    params,
    custom: { loading },
  });
};

// 省市区字典
export const appGetPbProvinceCityArea = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getPbProvinceCityArea', {
    params,
    custom: { loading },
  });
};

// 账单详情
export const appGetPbBalanceChangeDetail = (params, loading = false) => {
  return uni.$uv.http.get('/jeecg-boot/sys/wagesDetail/getPbBalanceChangeDetail', {
    params,
    custom: { loading },
  });
};

// 用户注销
export const appCancel = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/app/cancel', {
    params,
    custom: { loading },
  });
};

// 招聘举报
export const appReport = (params, loading = false) => {
  return uni.$uv.http.post('/jeecg-boot/recruitment/pbJobReport/addByApp', {
    params,
    custom: { loading },
  });
};