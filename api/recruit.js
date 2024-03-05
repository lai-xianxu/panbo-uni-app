// 岗位列表
export const getRecruitmentList = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbJobOpening/appList",
    params,
    {
      custom: { loading },
    }
  );
};

// 招聘岗位-通过id查询
export const getJobyById = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/recruitment/pbJobOpening/appQueryById", {
    params,
    custom: { loading },
  });
};

// 招聘-热门城市
export const getJobHotCity = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/recruitment/pbJobOpening/hotCity", {
    params,
    custom: { loading },
  });
};

// APP-城市-搜索
export const getCityList = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/area/pbCity/appList", {
    params,
    custom: { loading },
  });
};

// 我的在线简历
export const getMyResume = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/recruitment/pbResume/myResume", {
    params,
    custom: { loading },
  });
};

// 在线简历-招聘聊天
export const getPbResume = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResume/chatPage",
    params,
    {
      custom: { loading },
    }
  );
};
// 在线简历-发送消息
export const seedMsg = (params, loading = false) => {
  return uni.$uv.http.post("/jeecg-boot/recruitment/pbResume/seedMsg", params, {
    custom: { loading },
  });
};

// 在线简历-添加教育经历
export const addEducation = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResume/addEducation",
    params,
    {
      custom: { loading },
    }
  );
};

// 在线简历-添加工作经历
export const addWork = (params, loading = false) => {
  return uni.$uv.http.post("/jeecg-boot/recruitment/pbResume/addWork", params, {
    custom: { loading },
  });
};

// 在线简历-添加求职期望
export const addJob = (params, loading = false) => {
  return uni.$uv.http.post("/jeecg-boot/recruitment/pbResume/addJob", params, {
    custom: { loading },
  });
};

// 简历投递
export const resumeDelivery = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResumeDelivery/addByApp",
    params,
    {
      custom: { loading },
    }
  );
};

// 判断简历是否投递成功
export const isDeliverResumeDelivery = (params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/recruitment/pbResumeDelivery/isDeliver",
    {
      params,
      custom: { loading },
    }
  );
};

// 简历投递
export const getTradeDict = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/recruitment/pbResume/tradeDict", {
    params,
    custom: { loading },
  });
};

// 修改简历基本信息
export const editResumeBaseInfo = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResume/editUserInfo",
    params,
    {
      custom: { loading },
    }
  );
};

// 线简历-删除教育经历
export const deleteByEducation = (params, loading = false) => {
  return uni.$uv.http.delete(
    `/jeecg-boot/recruitment/pbResume/deleteByEducation?id=${params.id}`,
    {
      params,
      custom: { loading },
    }
  );
};

// 线简历-删除求职期望
export const deleteByJob = (params, loading = false) => {
  return uni.$uv.http.delete(
    `/jeecg-boot/recruitment/pbResume/deleteByJob?id=${params.id}`,
    params,
    {
      custom: { loading },
    }
  );
};


//APP-在线简历-删除工作经历
export const deleteByWork = (params, loading = false) => {
  return uni.$uv.http.delete(
    `/jeecg-boot/recruitment/pbResume/deleteByWork?id=${params.id}`,
  
    {
      custom: { loading },
    }
  );
};

//APP-在线简历-修改求职期望
export const updateJob = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResume/updateJob",
    params,
    {
      custom: { loading },
    }
  );
};

//APP-在线简历-修改教育经历
export const updateEducation = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResume/updateEducation",
    params,
    {
      custom: { loading },
    }
  );
};

//APP-在线简历-修改工作经历
export const updateWork = (params, loading = false) => {
  return uni.$uv.http.post(
    "/jeecg-boot/recruitment/pbResume/updateWork",
    params,
    {
      custom: { loading },
    }
  );
};

//APP-查看聊天对象
export const pbJobOpening = (params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/recruitment/pbJobOpening/appQueryById",
    {
      params,
      custom: { loading },
    }
  );
};

// APP-在线简历-求职状态
export const jobStatusDict = (params, loading = false) => {
  return uni.$uv.http.get(
    "/jeecg-boot/recruitment/pbResume/jobStatusDict",
    {
      params,
      custom: { loading },
    }
  );
};