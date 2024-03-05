// 首页轮播图
export const getAppBanner = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/app/appBanner/appList", {
    params,
    custom: { loading },
  });
};

// 首页金刚图
export const getConfigurationList = (params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/sys/wagesDetail/getPdAdvertisementConfigurationList",
    {
      params,
      custom: { loading },
    }
  );
};

// 获取收款码
export const getScanCode = ( loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/app/scan/code",
    {
      custom: { loading },
    },
    {
      responseType: "arraybuffer"
    }
  );
};

// 申请借款/备用金
export const pbLoanManagement = ( params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/loan/pbLoanManagement/appAdd",
    params,
    {
      custom: { loading },
    }
  );
};

// 申请借款/备用金 历史记录
export const pbLoanManagementList = ( params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/loan/pbLoanManagement/myList",
    params,
    {
      custom: { loading },
    }
  );
};


// 调息管理-获取利率
export const getInterestRate = ( params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/interest/pbInterestAdjustment/getInterestRate",
    params,
    {
      custom: { loading },
    }
  );
};

// 调息管理-获取利率
export const pbRecruitmentCompany = ( params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbRecruitmentCompany/dictList",
    {
      params,
      custom: { loading },
    }
  );
};

// 还款
export const repayment = ( params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/loan/pbLoanManagement/repayment",
    params,
    {
      custom: { loading },
    }
  );
};

// 转账
export const transfer = ( params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/app/scan/transfer",
    params,
    {
      custom: { loading },
    }
  );
};


// 获取指定类型链接
export const getOneByType = ( params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/insurance/url/getOneByType",
    {
      params,
      custom: { loading },
    }
  );
};

// 获取指定类型链接
export const allSearch = ( params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/app/appBanner/allSearch",
    {
      params,
      custom: { loading },
    }
  );
};