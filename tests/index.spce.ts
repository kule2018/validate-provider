import { ValidateProvider } from '../src/index';

test('add', (done) => {

  const provider = new ValidateProvider();

  provider.add<string>('test', (value: string) => {
    return value === 'xueyou';
  }, '值必须是xueyou, 不能是{{VALUE}}');

  provider.get<string>('test').method('a')
    .then((a) => {
      expect(a).toBeTruthy();
      done();
    })
    .catch(error => {
      expect(error.message).toBe('值必须是xueyou, 不能是a');
      done();
    });

});

test('addByMethodRegister', (done) => {

  const provider = new ValidateProvider();

  provider.addByMethodRegister<string>({
    name: 'test',
    method: (value: string) => { return value === 'xueyou'; },
    errMsg: '值必须是xueyou, 不能是{{VALUE}}',
  });

  provider.get<string>('test').method('a')
    .then((a) => {
      expect(a).toBeTruthy();
      done();
    })
    .catch(error => {
      expect(error.message).toBe('值必须是xueyou, 不能是a');
      done();
    });

});

test('return promise false status', async (done) => {

  const provider = new ValidateProvider();

  provider.add<string>('promise-success', async (value: string) => {
    return value === 'success';
  }, '验证失败');

  try {
    await provider.get<string>('promise-success').method('a');
    done();
  } catch (error) {
    expect(error.message).toBe('验证失败');
    done();
  }

});


test('return promise false message', async (done) => {

  const provider = new ValidateProvider();

  provider.add<string>('promise-success', async () => {
    throw new Error('验证失败了');
  });

  try {
    await provider.get('promise-success').method('');
    done();
  } catch (error) {
    expect(error.message).toBe('验证失败了');
    done();
  }

});


test('return promise false true', async (done) => {

  const provider = new ValidateProvider();

  provider.add<string>('promise-success', async (value: string) => {
    return value === 'success';
  }, '验证失败');

  try {
    await provider.get<string>('promise-success').method('success');
    done();
  } catch (error) {
    expect(error.message).toBe('验证失败');
    done();
  }

});


test('return string', async (done) => {

  const provider = new ValidateProvider();

  provider.add<string>('string', () => {
    return '覆盖默认错误提示';
  }, '验证失败');

  try {
    await provider.get<string>('string').method('a');
    done();
  } catch (error) {
    expect(error.message).toBe('覆盖默认错误提示');
    done();
  }

});