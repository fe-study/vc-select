
  @Vue Component - Select
  Author : IndexXuan(https://github.com/IndexXuan)
  Version: 0.7.0

  @changelog
  0517@v0.0.1: init
  0701@v0.1.0: fix selectAll selectCount bug
  0703@v0.1.1: 增加已选择面板功能,在超长列表中能快速取消已经选择的项目
  0720@v0.2.0: fix no value init crash bug
  0727@v0.3.0: fix watch value issue
  0728@v0.4.0: fix value is number bug
  0729@v0.4.1: dispatch style change
  0803@v0.4.2: 模板精简,作为一个内联块,同时清理、整理less
  0804@v0.5.0: 重构，总算清晰了一些。关于value类型的部分，只区分数组和其他合理类型两种，
               v0.2.0修复问题的同时引入了新的bug... 导致对value的反同步类型出错，小心啊...
               css上增强兼容性，保证本组件处于任意外部设置的长度时，搜索框和清除按钮布局正常
  0804@v0.6.0: pre release! 重写了vm <=> value的同步逻辑，在watch value中immediate，记录初始化value的类型
               新增reWriteValue方法，在select中调用，
               新增includes方法判断是否选中，避免了原生的indexOf的类型太严格的问题
               完整测试了两中全选方式，多种初始化value类型，将selectAllBehavior默认设为更自然的'allChecked'
               保证三个项目选中就显示的同时，css做了文字溢出隐藏
               删除了无用代码，更清晰，代码格式优化，风格处理，待出稳定版，pre release
  0809@v0.7.0: 修复`vm = []`时，未触发reWriteValue逻辑中的任何分支，导致value未进行同步
  0810@v0.8.0: 去除options#coerce方法的冗余兼容，对符合结构的Array直接返回使用，对Object仅做简单转换，对其他直接返回
