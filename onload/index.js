let exampleOnLoadPlugin = {
  name: "example",
  setup(build) {
    let fs = require("fs");

    // Load ".txt" files and return an array of words
    build.onLoad({ filter: /\.txt$/ }, async (args) => {
      console.log(args);
      let text = await fs.promises.readFile(args.path, "utf8");
      // 因为内容是 json 的，所以必须用 json loader ？
      // 可以尝试关闭 loader 这一行代码，输出的结果是不一样的

      // todo
      // 如果当前的这个不返回 contents 的话，那么就会交给下一个插件来做处理
      // 这里缺个 demo
      return {
        contents: JSON.stringify(text.split(/\s+/)),
        loader: "json",
      };
    });
  },
};

require("esbuild")
  .build({
    entryPoints: ["app.js"],
    bundle: true,
    outfile: "out.js",
    plugins: [exampleOnLoadPlugin],
  })
  .catch(() => process.exit(1));
