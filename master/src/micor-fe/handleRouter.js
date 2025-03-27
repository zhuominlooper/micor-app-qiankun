import { getApps } from "./index";
import { importHTML } from "./import-html";
import { preRouter } from "./watchRouter";
//处理路由的变化

//防止重复的监听处理
let isRun = false;
const handleRouter = async () => {
  if (isRun) {
    return;
  }
  //切换路由时候，要卸载上一个微应用
  //获取上一个应用
  const apps = getApps();
  const prevApp = apps.find((app) => {
    return preRouter.startsWith(app.activeRule);
  });

  //拿到当前切换路由的应用
  const curPath = window.location.pathname;
  let app = apps.find((item) => curPath.startsWith(item.activeRule));
  //先销毁
  if (prevApp) {
    await mainUnmount(prevApp);
  }
  isRun = true;

  if (!app) {
    isRun = false;
    return;
  }
  window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ = app.entry;

  //3.加载子应用资源
  const { template, execScripts } = await importHTML(app.entry);
  const container = document.querySelector(app.container);
  container.appendChild(template);
  //innerhtml加载资源之后，浏览器为了安全起见，不会执行script脚本，所以要单独处理
  //获取所有的entry.html的script字符串
  const { bootstrap, mount, unmount } = await execScripts();
  app.bootstrap = bootstrap;
  app.mount = mount;
  app.unmount = unmount;
  await mainBootstrap(app);
  await mainMount(app);
  //await mainUnmount(app);
  isRun = false;
};

async function mainBootstrap(app) {
  app.bootstrap && (await app.bootstrap());
}
async function mainMount(app) {
  app.mount &&
    (await app.mount({
      container: document.querySelector(app.container),
    }));
}
async function mainUnmount(app) {
  app.unmount &&
    (await app.unmount({
      container: document.querySelector(app.container),
    }));
}

export default handleRouter;
