## onResolve

使用 onResolve 添加的回调将在 esbuild 生成的每个模块中的每个导入路径上运行。回调可以自定义 esbuild 的路径解析方式。例如，它可以拦截导入路径并将其重定向到其他地方。它还可以将路径标记为外部路径。

用于解析 import 时调用，可以在这里给改变一个 元信息，方便后续的再处理

默认的导出是 file ，也就是 namespace: file

如果是 file 的话，那么 esbuild 会有一个自己处理 file 的逻辑，

拟人一点的话，就是说，给文件分不同的类型，如果是 file 的话，就要送去 file 的处理场了


path: 改变 path 会显示什么呢？

```js
// onResolve 回调函数第一个参数返回的结果

 build.onResolve({ filter: /^env$/ }, (args) => {
      console.log(args);
      return {
        path: args.path,
        namespace: "env-ns",
      };
 });


// result
{
  path: 'env',
  importer: '/Users/cuixiaorui/Code/learn-esbuild/plugin/app.js',
  namespace: 'file',
  resolveDir: '/Users/cuixiaorui/Code/learn-esbuild/plugin',
  kind: 'import-statement',
  pluginData: undefined
}
```
