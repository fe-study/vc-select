<h1 align="center">vc-select - @changelog</h1>

## 0.11.3

`2017-01-06`

- 去除不应该被调用的 `closeSelectList`， 安装最新的 `vue-devtool` 发现的

## 0.11.2

`2016-12-19`

- fix在没有下拉数据的情况下去除拼接label可能带来的潜在的 `:：` 问题
- 去除默认的 `width` 数值，大多数情况下就不合适的，可覆盖却要用到important

## 0.11.1

`2016-12-15`

- fix `methods#select` 中lazy模式判断的疏漏,不应该包裹在else里
- fix `tags` 模式下输入框中删除选中项不同步vm的bug(增加show = false时候的同步)
- fix `tags` 模式下删除到最后一个时，`watch#vm` 中对selectedOptions的置空更新(原来直接return了)
- 增加了一些 `[vc-select warn]`, 便于debug
- 去掉了 `暂无xxx选项` 中选项字样，因为为了 `label` 的灵活性，有时候会带有":", 拼接起来很难看

## 0.11.0

`2016-10-14`

- `vc-option` privite to `vc-select` 

## 0.10.0 `prerelease`

`2016-09-06` - `2016-09-09`

- 代码格式优化，注释优化，细节优化

- 不明原因bug，导致初始化全选功能组件值不同步到父组件(首次.sync失效)
  - 通过直接改写父组件值解决...

- 新增 `vc-option` 配合型子组件，更多使用方式拓展，依旧支持父组件value为数组或非数组(逗号分割字符串)

- 新增 `disabled` 属性
  - 可在 `vc-option` 中使用
  - 也可以提供 `options` 属性，结构为 `Array<Object{value, label, + disabled: true}>`

- 去除Vue2.0不推荐的 `coerce`, `filter in v-for` 等用法，大量使用计算属性

- bug fix 
  - 去除错误的 `showSelectAllOption` 判断，解决不显示 `全部` 则选项无法自动全选的bug

- 新增 `width` 属性，默认 `200px` (宽度不包含label) 
- 新增 `tags` 属性，标签式展示选中项，可点击删除
- 新增 `vm.$root['vc-select-pool']` 挂载，用于解决全局只能有一个下拉菜单处于打开状态
- 新增 `onSelect`, `onShow`, `onHide` 事件接口

- 样式优化

- 新增 `lazy` 属性
  - 用于决定下拉选择所选值是立即同步到value还是下拉关闭后同步
  - 为一些联动渲染场景优化提供可能和选择

- bug fix 
  - 解决 `value` 初始化watch时使内部 `vm` 和 `value` 引用相同的问题
  - 使得 `reWriteValue` 真正可用，并是数据同步的唯一方法
  - 使得 `lazy` 属性真正可实现

- 项目结构调整，注释优化

## 0.9.0

`2016-08-27`

- break change! rename `search` to `searchable`
- 新增 `height` 属性，控制下拉菜单长度，默认 `400px`

## 0.8.1

`2016-08-16`

- 增加button的title属性，增强体验

## 0.8.0

`2016-08-10`

- 去除options#coerce方法的冗余兼容，对符合结构的Array直接返回使用，对Object仅做简单转换，对其他直接返回

## 0.7.0

`2016-08-09`

- 修复`vm = []`时，未触发reWriteValue逻辑中的任何分支，导致value未进行同步

## 0.6.0 `pre release` 

`2016-08-04`

- 重写了vm <=> value的同步逻辑，在watch value中immediate，记录初始化value的类型
- 新增reWriteValue方法，在select中调用，
- 新增includes方法判断是否选中，避免了原生的indexOf的类型太严格的问题
- 完整测试了两中全选方式，多种初始化value类型，将selectAllBehavior默认设为更自然的'allChecked'
- 保证三个项目选中就显示的同时，css做了文字溢出隐藏
- 删除了无用代码，更清晰，代码格式优化，风格处理，待出稳定版，pre release

## 0.5.0

`2016-08-04`

- 重构，总算清晰了一些。关于value类型的部分，只区分数组和其他合理类型两种，
- v0.2.0修复问题的同时引入了新的bug... 导致对value的反同步类型出错，小心啊...
- css上增强兼容性，保证本组件处于任意外部设置的长度时，搜索框和清除按钮布局正常

## 0.4.2

`2016-08-03`

- 模板精简,作为一个内联块,同时清理、整理less

## 0.4.1

`2016-07-29`

- dispatch style change

## 0.4.0

`2016-07-28`

- fix value is number bug

## 0.3.0

`2016-07-27`

- fix watch value issue

## 0.2.0

`2016-07-20`

- fix no value init crash bug

## v0.1.1

`2016-07-03`

- 增加已选择面板功能,在超长列表中能快速取消已经选择的项目

## 0.1.0

`2016-07-01`

- fix selectAll selectCount bug

## 0.0.1

`2016-05-09`

- init

