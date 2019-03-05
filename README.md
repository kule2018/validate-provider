# validate-provider

> 验证提供方, 作为管理验证函数的容器. 基于`Promise`

支持:

-   验证函数中返回布尔值, 则代表验证状态
-   验证函数中抛出异常, 则验证失败, 并将异常`error.message`作为验证失败消息
-   验证函数可以是`Promise`方法

## Install And Usega

Using Browser:

```html
<script src="./validate-provider.js"></script>
<script>
    var provider = new ValidateProvider();

    provider.add(
        "IsPhone",
        (val: string) => {
            return /^(13[0-9]|15[0123456789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(val);
        },
        "手机号不正确"
    );

    provider
        .get("IsPhone")
        .method("xueyoucd@gmail.com")
        .then(() => {
            console.log("验证成功");
        })
        .catch((error) => {
            console.log("验证失败, 原因:", error.message);
        });
</script>
```

Or Using npm:

```sh
npm install --save @validate/validate-provider
```

```js
import { ValidateProvider } from "@validate/validate-provider";

// 实例化验证提供方
var provider = new ValidateProvider();
// 添加验证函数到容器
provider.add(
    "IsPhone",
    (val: string) => {
        return /^(13[0-9]|15[0123456789]|17[03678]|18[0-9]|14[57])[0-9]{8}$/.test(val);
    },
    "手机号不正确"
);
// 执行验证函数
provider
    .get("IsPhone")
    .method("xueyoucd@gmail.com")
    .then(() => {
        console.log("验证成功");
    })
    .catch((error) => {
        console.log("验证失败, 原因:", error.message);
    });
```

---

## 验证提供方使用

-   `provider.add(name: string, method: Function, errMsg?: string)` 添加验证函数
-   `provider.addByMethodRegister(methodRegister: IMethodRegister)` 添加验证函数

### 异步验证函数

```js
provider.add("async-valid", async (val: string) => {
    if (val === "123456") {
        return true;
    } else {
        throw new Error("异步验证失败");
    }
});
```

---

## 接口与类

### IMethodRegister

```typescript
/**
 * 验证函数注册信息
 */
export interface IMethodRegister {
    /**
     * 验证函数名称
     */
    name: string;
    /**
     * 验证函数
     * @description 返回promise则根据状态确认验证结果, 返回boolean则根据布尔确认结果, 返回字符串则总是失败结果, 并将字符串作为失败消息
     */
    method?: Function;
    /**
     * 是否动态验证
     */
    dynamic?: boolean;
    /**
     * 默认验证错误消息
     */
    errMsg?: string;
    /**
     * 验证错误消息格式化函数
     */
    format?: (value: any, params: any[], message: string) => string;
}
```

### ValidateMethodError

```typescript
const error: ValidateMethodError;
// 验证值
console.log(error.value);
// 验证参数
console.log(error.params);
// 验证错误消息
console.log(error.message);
// 验证函数名称
console.log(error.validName);
```
