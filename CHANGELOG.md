# Change Log

## 1.0.31 (March 8, 2019)

-   更改输出目标`esnext`为`es6`
-   更改`.d.ts`目录为`typings`

## 1.0.3 (March, 5, 2019)

-   更新依赖版本
-   分离 es, lib 打包
-   修复 tests 文件正确结尾单词`*.spec.ts`
-   使用`tsc`打包`es`版, 使用`rollup`打包单文件版本

## 1.0.2 (October, 26, 2018)

-   验证包裹函数`resolve`参数从`boolean`改为`IMethodRegister`类型, 以便提供验证信息

## 1.0.1 (October, 26, 2018)

-   增加`publish`前编译
-   增加`tsconfig.json`中的`esModuleInterop`, 来支持`jest`在`typescript3.x`中的报错

## 1.0.0 (October 11, 2018)

-   初始化项目
