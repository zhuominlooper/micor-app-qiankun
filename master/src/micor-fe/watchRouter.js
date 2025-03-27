import handleRouter from "./handleRouter";

export let preRouter = ""; //上一个路由
export let nextRouter = ""; //当前路由
const watchRouter = () => {
  //监视hash
  // window.onhashchange

  //监听go,back,foward
  window.addEventListener("popstate", () => {
    preRouter = nextRouter;
    nextRouter = window.location.pathname;
    handleRouter();
  });
  //pushState和replaceState需要通过劫持来处理
  const rawPushState = window.history.pushState;
  const rawReplaceState = window.history.replaceState;

  //重写劫持
  window.history.pushState = (...args) => {
    //记录导航前后的路由
    preRouter = window.location.pathname;
    rawPushState.apply(window.history, args);
    nextRouter = window.location.pathname;
    handleRouter();
  };

  window.history.replaceState = (...args) => {
    preRouter = window.location.pathname;
    rawReplaceState.apply(window.history, args);
    nextRouter = window.location.pathname;
    handleRouter();
  };
};
export default watchRouter;
