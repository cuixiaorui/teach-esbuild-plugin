// 1. 一开始的时候先用 onResolve 把 https? 开头的 import 给标记成 http-url 之后
// 2. 然后开始调用 onload 开始加载
// 3. onload 加载其他的内容之后，在返回其 contents 之后，这时候会在进行 build ，所以如果有 import 语法的话，那么就会再次的触发 onResolve 回调
//  因为第一个 onResolve 已经把 https 的文件给标记成 http-url 了，所以在第二个 onResolve 的时候就可以通过 namespace 来进一步筛选
//  在第二个 onResolve 的时候是需要处理导入的路径，
//  比如  ./toPairs.js 那么就需要给变成 https://unpkg.com/lodash-es@4.17.15/toPairs.js , 然后再次触发 onload 进行加载

let httpPlugin = {
  name: "http",
  setup(build) {
    let https = require("https");
    let http = require("http");

    // Intercept import paths starting with "http:" and "https:" so
    // esbuild doesn't attempt to map them to a file system location.
    // Tag them with the "http-url" namespace to associate them with
    // this plugin.
    build.onResolve({ filter: /^https?:\/\// }, (args) => {
      console.log("first-resolve", args);
      return {
        path: args.path,
        namespace: "http-url",
      };
    });

    // We also want to intercept all import paths inside downloaded
    // files and resolve them against the original URL. All of these
    // files will be in the "http-url" namespace. Make sure to keep
    // the newly resolved URL in the "http-url" namespace so imports
    // inside it will also be resolved as URLs recursively.

    build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => {
      console.log("second-resolve", args);
      // 这里可能是把像 ./xx.js 处理成基于 args.path 的路径
      return {
        path: new URL(args.path, args.importer).toString(),
        namespace: "http-url",
      };
    });

    // When a URL is loaded, we want to actually download the content
    // from the internet. This has just enough logic to be able to
    // handle the example import from unpkg.com but in reality this
    // would probably need to be more complex.
    build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
      console.log("onload", args);
      let contents = await new Promise((resolve, reject) => {
        function fetch(url) {
          console.log(`Downloading: ${url}`);
          let lib = url.startsWith("https") ? https : http;
          let req = lib
            .get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                fetch(new URL(res.headers.location, url).toString());
                req.abort();
              } else if (res.statusCode === 200) {
                let chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
              } else {
                reject(
                  new Error(`GET ${url} failed: status ${res.statusCode}`)
                );
              }
            })
            .on("error", reject);
        }
        fetch(args.path);
      });
      return { contents };
    });
  },
};

require("esbuild")
  .build({
    entryPoints: ["app.js"],
    bundle: true,
    outfile: "out.js",
    plugins: [httpPlugin],
  })
  .catch(() => process.exit(1));
