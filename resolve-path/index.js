const path = require('path');
let exampleOnResolvePlugin = {
  name: "env",
  setup(build) {
    // 来测试一下 改变了 path 会影响什么
    // build.onResolve({ filter: /^https?\/\// }, (args) => {
    //   return {
    //     path: "auto path",
    //     namespace: "env-ns",
    //   };
    // });

    // build.onResolve({ filter: /^https?:\/\// }, (args) => {
    //   return { path: args.path, external: true };
    // });

    // Redirect all paths starting with "images/" to "./public/images/"
    // build.onResolve({ filter: /^images\// }, (args) => {
    //   return { path: path.join(args.resolveDir, "public", args.path) };
    // });
    // 这里如果是 path 被改变的话，
    // 在后续的 build 处理过程中会读取新的 path 的路径
    // 那么其实这里就是通过返回一个对当前 path 对象的信息
    // 来后续做进一步的处理
    // 比如这里的 path 被处理成 images/public/logo.png
    // 那么后续在 load 的时候就会去新的path 去加载

    build.onResolve({ filter: /^images\// }, (args) => {
      console.log(args)
      return { path: path.join(args.resolveDir, "public", args.path) };
    });
  },
};

require("esbuild")
  .build({
    entryPoints: ["app.js"],
    bundle: true,
    outfile: "out.js",
    plugins: [exampleOnResolvePlugin],
    loader: { ".png": "binary" },
  })
  .catch(() => process.exit(1));
