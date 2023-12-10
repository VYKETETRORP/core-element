import { ElMessage } from "element-plus";

export default {
  install(app) {
    app.config.globalProperties.$notify = notification;
    app.provide(`$notify`, notification);
  },
};

const notify = (content, loading = false, level = "info") => {
  ElMessage({
    type: level,
    showClose: true,
    message: content,
  });
};
export const notification = {
  success(content) {
    notify(content, false, "success");
  },
  success(content) {
    notify(content, false, "success");
  },
  warning(content) {
    notify(content, false, "warning");
  },
  error(content) {
    notify(content, false, "error");
  },
  info(content) {
    notify(content, false, "info");
  },
  loading(content) {
    notify(content, true, "info");
  },
  dismiss() {},
};
