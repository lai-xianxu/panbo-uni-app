// 咨询列表
export const getInformationList = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/information/pbInformation/appList",
    params,
    {
      custom: { loading },
    }
  );
};

// 咨询详情
export const getInformatioByid = (params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/information/pbInformation/appQueryById",
    {
      params,
      custom: { loading },
    }
  );
};
