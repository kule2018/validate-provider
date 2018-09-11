// 显示打包进度
import progress from 'rollup-plugin-progress';
// 解析node_modules里的包
import resolve from 'rollup-plugin-node-resolve';
// 解析ts
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: [
    {
      // 打包成浏览器或node能调用的
      file: 'dist/validate-provider.js',
      format: 'umd',
      name: 'ValidateProvider',
    },
    {
      // 打包成es文件, 方便其他项目直接进入调用
      file: 'dist/validate-provider.es.js',
      format: 'es',
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    typescript(),
    progress({ clearLine: false, }),
  ],
};