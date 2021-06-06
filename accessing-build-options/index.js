let examplePlugin = {
  name: "auto-node-env",
  setup(build) {
    console.log(build.initialOptions);
    const options = build.initialOptions;
    // 这里是可以对其修改的，比如这里就修改了 outfile 的值
    options.outfile = "out-new.js"
    options.define = options.define || {};
    options.define["process.env.NODE_ENV"] = options.minify
      ? '"production"'
      : '"development"';
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
