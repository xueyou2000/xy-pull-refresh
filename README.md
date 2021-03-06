| ![IE](https://github.com/alrra/browser-logos/blob/master/src/edge/edge_48x48.png?raw=true) | ![Chrome](https://github.com/alrra/browser-logos/blob/master/src/chrome/chrome_48x48.png?raw=true) | ![Firefox](https://github.com/alrra/browser-logos/blob/master/src/firefox/firefox_48x48.png?raw=true) | ![Opera](https://github.com/alrra/browser-logos/blob/master/src/opera/opera_48x48.png?raw=true) | ![Safari](https://github.com/alrra/browser-logos/blob/master/src/safari/safari_48x48.png?raw=true) |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| IE 10+ ✔                                                                                   | Chrome 31.0+ ✔                                                                                     | Firefox 31.0+ ✔                                                                                       | Opera 30.0+ ✔                                                                                   | Safari 7.0+ ✔                                                                                      |

![NPM version](http://img.shields.io/npm/v/xy-pull-refresh.svg?style=flat-square)
![node version](https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square)
![npm download](https://img.shields.io/npm/dm/xy-pull-refresh.svg?style=flat-square)

[![xy-pull-refresh](https://nodei.co/npm/xy-pull-refresh.png)](https://npmjs.org/package/xy-pull-refresh)

# xy-pull-refresh

下拉刷新，下滑加载组件

## 安装

```bash
# yarn
yarn add xy-pull-refresh
```

## 使用例子

```tsx
import React from "react";
import ReactDOM from "react-dom";
import PullRefresh from "xy-pull-refresh";
ReactDOM.render(
    <PullRefresh onLoadMore={loadData} onPullRefresh={refresh} enablePullRefresh={true}>
        <ul>
            <li>a</li>
        </ul>
    </PullRefresh>,
    container
);
```

## API

| 属性                 | 说明                                                                            | 类型                                | 默认值         |
| -------------------- | ------------------------------------------------------------------------------- | ----------------------------------- | -------------- |
| loading              | 是否正在加载数据/刷新数据                                                       | boolean                             | `false`        |
| isNoMoreData         | 是否没有更多数据                                                                | boolean                             | `false`        |
| enableLoadMore       | 是否开启加载更多, 滚动到底部会触发加载更多事件                                  | boolean                             | `true`         |
| enablePullRefresh    | 是否开启下拉刷新                                                                | boolean                             | `false`        |
| initLock             | 是否初始化锁定,在多个 tab 情况下，默认不是当前激活 tab 的，不需要主动去加载数据 | boolean                             | `true`         |
| threshold            | 阈值, 下拉到距离以上刷新                                                        | number                              | 150            |
| onLoadMore           | 加载更多事件                                                                    | Function                            | -              |
| onPullRefresh        | 下拉刷新事件                                                                    | Function                            | -              |
| noMoreDataNode       | 没有数据元素                                                                    | React.ReactNode                     | `没有更多数据` |
| bottomIndicatorTips  | 上滑加载提示元素                                                                | React.ReactNode                     | `上滑加载数据` |
| notEnoughRefreshNode | 不够下拉刷新时提示                                                              | React.ReactNode, GetPullRefreshNode | -              |
| overRefreshNode      | 足够下拉刷新时提示                                                              | React.ReactNode                     | -              |

## 开发

```sh
yarn run start
```

## 例子

http://localhost:6006

## 测试

```
yarn run test
```

## 开源许可

xy-pull-refresh is released under the MIT license.
