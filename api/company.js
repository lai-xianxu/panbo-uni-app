// 企业详情 /jeecg-boot/recruitment/pbRecruitmentCompany/appQueryById
export const getCompanyById = (params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/recruitment/pbRecruitmentCompany/appQueryById",
    {
      params,
      custom: { loading },
    }
  );
};

// 我的邀请记录
export const getMyInviteList = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/app/invite/page", {
    params,
    custom: { loading },
  });
};

// 邀请二维码
export const getInviteCode = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/app/invite/code",
    {
      custom: { loading },
    },
    {
      responseType: "arraybuffer",
    }
  );
};
// 邀请被绑定人
export const getInviteInvite = (params, loading = false) => {
  return uni.$uv.http.post("/jeecg-boot/app/invite/invite", params, {
    custom: { loading },
  });
};

// 邀请权限
export const isInviteAuth = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/app/invite/isInviteAuth", {
    params,
    custom: { loading },
  });
};
