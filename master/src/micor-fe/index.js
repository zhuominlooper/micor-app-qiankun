import watchRouter from "./watchRouter";
import handleRouter from "./handleRouter";
let _apps = [];

//拿到配置
export const getApps = () => _apps;

//保存微应用的配置
export const registerMicroApps = (apps) => {
  _apps = apps;
};

//start启动监听路由变化，
export const start = () => {
  //配置微应用的全局变量
  window.__POWERED_BY_QIANKUN__ = true;

  // 1.监听路由变化(history路由)
  watchRouter();
  //手动处理,处理刷新时候的情况
  handleRouter();
};

/*
微前端运行原理
1.监视路由变化
2.匹配子应用
3.加载子应用
4.渲染子应用
*/
