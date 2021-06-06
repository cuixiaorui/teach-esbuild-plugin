## TODO

可以参考阮一峰的方式来组织写 plugin 插件的教程

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

## onLoad

对于每个未标记为外部的唯一路径/命名空间对，将运行使用 onLoad 添加的回调。

它的任务是返回模块的内容并告诉 esbuild 如何解释它。

```js
interface OnLoadArgs {
  path: string;
  namespace: string;
  pluginData: any;
}
```

pluginData 是上一个插件传过来得数据

todo， 可以搞个 demo 来试试看

```js
interface OnLoadResult {
  contents?: string | Uint8Array;
  errors?: Message[];
  loader?: Loader;
  pluginData?: any;
  pluginName?: string;
  resolveDir?: string;
  warnings?: Message[];
  watchDirs?: string[];
  watchFiles?: string[];
}

interface Message {
  text: string;
  location: Location | null;
  detail: any; // The original error from a JavaScript plugin, if applicable
}

interface Location {
  file: string;
  namespace: string;
  line: number; // 1-based
  column: number; // 0-based, in bytes
  length: number; // in bytes
  lineText: string;
}
```

这里返回的结果是 onload return 的结果值

这里就可以通过 pluginData 把数据给到下一个插件，这样就可以达到插件和插件之间的数据交互了

但是并不是简单的给到 下一个 onload 回调，因为有可能返回的 contents 是需要在进一步处理的，所以会触发 onResolve ，然后由 onResolve return 结果

> 这里需要一个 demo 来验证这个想法

这里对 contents 的处理步骤是可以通过缓存来进行优化的。

至于怎么缓存，自己想把 哈哈哈

## Start callbacks

注册一个开始回调，以便在新生成启动时得到通知。这个触发器适用于所有构建，而不仅仅是初始构建，因此对于增量构建、观察模式和服务 API 尤其有用。

```js
let examplePlugin = {
  name: "example",
  setup(build) {
    build.onStart(() => {
      console.log("build started");
    });
  },
};
```

注意，不应该在开始回调中做初始化的逻辑，因为他会在好几种情况下都进行调用。

初始化逻辑直接写在 setup 中就可以了

## End callbacks

注册新生成结束时要通知的结束回调。这个触发器适用于所有构建，而不仅仅是初始构建，因此对于增量构建、观察模式和服务 API 尤其有用。

end 有两种情况

1. 正常结束，构建完成
2. 报错了。不正常退出。那么就需要对 error 做进一步处理了，比如说可以把 error 信息收集起来

## Accessing build options

插件可以从 setup 方法中访问初始构建选项。这允许您检查生成是如何配置的，以及在生成启动之前修改生成选项。

就是可以看初始的构建信息

然后还可以让你对其进行修改

TODO: 在 onStart 之后在修改就没有了。不过这个点还没有验证
