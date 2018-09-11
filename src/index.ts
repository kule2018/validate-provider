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

/**
 * 验证函数信息
 */
export interface IMethodInfo<TValue = {}> extends IMethodRegister {
  /**
   * promise化验证函数
   */
  method: (value: TValue, ...params: any[]) => Promise<boolean>;
}

/**
 * @class ValidateMethodError
 * @description 验证失败异常
 */
export class ValidateMethodError<TValue = {}> extends Error {
  /**
   * 被验证的值
   */
  public value: TValue = null;
  /**
   * 验证参数
   */
  public params: any[] = null;
  /**
   * 验证函数名称
   */
  public validName: string = null;

  /**
   * 构造函数
   * @param value 验证值
   * @param params 验证参数
   * @param message 验证错误消息
   * @param validName 验证函数名称
   */
  constructor(value: TValue, params: any[], message: string, validName: string) {
    super(message);
    this.name = 'ValidFailError';
    this.value = value;
    this.params = params;
    this.validName = validName;
  }
}


/**
 * 验证提供方
 * @class ValidateProvider
 * @description 用键值对的字典存储验证函数
 */
export class ValidateProvider {

  // 无序字典存储验证函数
  protected dictionary: { [key: string]: IMethodInfo } = {};

  /**
   * 构造函数
   * @param other 
   */
  constructor(other?: ValidateProvider) {
    this.merge(other);
  }

  /**
   * 添加验证函数
   * @param name 验证函数名称
   * @param method 验证函数
   * @param errMsg 默认验证错误消息
   */
  public add<TValue>(name: string, method: Function, errMsg?: string) {
    this.addByMethodRegister<TValue>({name, method, errMsg});
  }

  /**
   * 添加验证函数
   * @param methodRegister 验证函数注册信息
   */
  public addByMethodRegister<TValue>(methodRegister: IMethodRegister) {
    const { method, ...rest } = methodRegister;
    const methodInfo: IMethodInfo<TValue> = {
      ...rest,
      method: ValidateProvider.PromisefyValidMethod<TValue>(methodRegister),
    };
    this.dictionary[methodRegister.name] = methodInfo;
    return this;
  }

  /**
   * 获取验证函数注册信息
   * @param name 验证函数名称
   */
  public get<TValue>(name: string): IMethodInfo<TValue> {
    const { dictionary } = this;
    if (dictionary[name]) { return dictionary[name]; }
    for (let validName in dictionary) {
      const methodRegister: IMethodInfo<TValue> = dictionary[validName];
      if (validName.toLocaleLowerCase() === name.toLocaleLowerCase()) { return methodRegister; }
    }
    return null;
  }

  /**
   * 合并提供方
   * @param other 要合并的验证提供方
   */
  public merge(other: ValidateProvider): ValidateProvider {
    if (!other) { return this; }
    const { dictionary } = this;
    for (let name in other.dictionary) {
      dictionary[name] = other.get(name);
    }
    return this;
  }

  /**
   * 遍历验证函数
   * @param callback 回调函数
   */
  public each(callback: (name: string, methodInfo: IMethodInfo) => void) {
    const { dictionary } = this;
    for (let name in dictionary) {
      callback(name, dictionary[name])
    }
  }

  /**
   * 格式化错误消息
   * @description 默认格式化函数根据数组来完成 {0},{1} 对应参数数组 params, 另外提供额外的 {{VALUE}} 标记当前值
   * @param methodRegister 验证函数注册信息
   * @param value 验证值
   * @param params 验证参数
   * @param message 默认验证消息
   */
  public static FormatMessage<TValue>(methodRegister: IMethodRegister, value: TValue, params: any[], message?: string): string {
    const { format, errMsg } = methodRegister;
    const msg = message || errMsg;

    if (format) {
      // 使用自定义消息格式化
      return format(value, params, msg);
    } else {
      if (!msg) { return ''; }
      // 使用内置格式化
      return msg.replace(/{(\d)}/g, function (match: string, index: string) {
        var i = parseInt(index);
        return i >= 0 && i < params.length ? params[i] : match;
      }).replace(/{{VALUE}}/g, String(value));
    }
  }

  /**
   * promise化验证函数
   * @param methodRegister 验证函数注册信息
   */
  public static PromisefyValidMethod<TValue>(methodRegister: IMethodRegister) {
    const { name, method } = methodRegister;

    return function (value: TValue, ...params: any[]) {
      var ctx = this;
      let args = [].slice.call(arguments, 0);
      return new Promise<boolean>((resolve, reject) => {
        // 验证失败异常
        let validError = new ValidateMethodError(
          value, 
          params,
          ValidateProvider.FormatMessage<TValue>(methodRegister, value, params, methodRegister.errMsg),
          name);

        try {
          // 执行验证函数
          const result = method.apply(ctx, args);
          if (result instanceof Promise) {
            result.then(() => resolve(true)).catch((error) => {
              validError.message = ValidateProvider.FormatMessage<TValue>(methodRegister, value, params, error.message);
              reject(validError);
            });
          } else if ((typeof result) === 'boolean') {
            result === true ? resolve(true) : reject(validError);
          } else if ((typeof result) === 'string') {
            validError.message = ValidateProvider.FormatMessage<TValue>(methodRegister, value, params, result);
            reject(validError);
          } else {
            throw new TypeError('未知的验证函数返回类型, 仅支持: ["Promise", "boolean", "string"]');
          }
        } catch (error) {
          validError.message = error.message;
          reject(validError);
        }
      });
    };
  }

}