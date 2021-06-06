let examplePlugin = {
  name: "example",
  setup(build) {
    build.onStart(() => {
        // 在 watch 模式下也会调用的
        // 怎么开启 watch 模式呢？ 还不知道
      console.log("build started");
    });
  },
};

require("esbuild")
  .build({
    entryPoints: ["app.js"],
    bundle: true,
    outfile: "out.js",
    plugins: [examplePlugin],
  })
  .catch(() => process.exit(1));
