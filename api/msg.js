// 我的消息
export const getMyMessage = (params, loading = false) => {
  return uni.$uv.http.post("/jeecg-boot/app/getMyAppAnnouncementSend", params, {
    custom: { loading },
  });
};

// 消息阅读状态
export const getMsgStatus = (params, loading = false) => {
  return uni.$uv.http.get("/jeecg-boot/app/selectMsgStatus", {
    params,
    custom: { loading },
  });
};

// 消息已读
export const editByAnntIdAndUserId = (params, loading = false) => {
  return uni.$uv.http.put(
    "/jeecg-boot/sys/sysAnnouncementSend/editByAnntIdAndUserId",
    params
  );
};
