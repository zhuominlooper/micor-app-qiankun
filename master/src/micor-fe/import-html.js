import { fetchData } from "./fetch";
export const importHTML = async (url) => {
  //请求子应用资源css,html,js
  const html = await fetchData(url);
  const template = document.createElement("div");
  template.innerHTML = html;

  const scripts = template.querySelectorAll("script");

  //获取所有的script代码
  const getExternalScripts = async () => {
    return Promise.all(
      Array.from(scripts).map((script) => {
        //判断当前script是否有src外链
        const src = script.getAttribute("src");
        if (!src) {
          return Promise.resolve(script.innerHTML);
        }
        //外链处理
        let fetchSrc =
          src.startsWith("http") || src.startsWith("https")
            ? src
            : url.slice(0, url.length - 1) + src;
        return fetchData(fetchSrc);
      })
    );
  };

  //执行js脚本代码
  const execScripts = async () => {
    const scripts = await getExternalScripts();
    //构造一个cjs的环境，方便在拿子应用umd格式的导出块
    const module = { exports: {} };
    const exports = module.exports;
    //执行js字符串，eval(可以访问外部变量，没有作用域)或者new Fun
    scripts.forEach((script) => {
      eval(script);
    });
    //脚本执行完，拿到子应用的生命周期钩子，由于模拟了一个cjs环境
    return module.exports;
  };
  return {
    template,
    getExternalScripts,
    execScripts,
  };
};
