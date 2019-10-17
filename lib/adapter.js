
/**
 * 创建一个可以接收n个参数的函数, 忽略其他额外的参数。
 * 调用提供的函数fn,参数最多为n个, 使用 Array.prototype.slice(0,n) 和展开操作符 (...)。
 * 可以用于不定参数的处理
 * 官方示例
 * const firstTwoMax = ary(Math.max, 2);
   [[2, 6, 'a'], [8, 4, 6], [10]].map(x => firstTwoMax(...x)); // [6, 8, 10]
 * 
 */
ary = (fn, n) => (...args) => {
    return fn(...args.slice(0, n));
}

/**
 * 给定一个key和一组参数，给定一个上下文时调用它们。主要用于合并。
 * 使用闭包调用上下文中key对应的值，即带有存储参数的函数。
 * 可适应用调用同一上下文中的不同函数
 * demo
 * Promise.resolve([1, 2, 3])
    .then(call('map', x => 2 * x))
    .then(console.log); // [ 2, 4, 6 ]
 *  demo1
    const fun = {
        'console': function(data) {
            console.log(data)
        }
    }
    let c = call('console', ['name', 'xxx'])(fun) // [ 'name', 'xxx' ]
 */
const call = (key, ...args) => {
    return context => {
        return context[key](...args);
    }
}

/**
 * 将一个接收数组参数的函数改变为可变参数的函数。
 * demo
 * const Pall = collectInto(Promise.all.bind(Promise));
    let p1 = Promise.resolve(1);
    let p2 = Promise.resolve(2);
    let p3 = new Promise(resolve => setTimeout(resolve, 2000, 3));
    Pall(p1, p2, p3).then(console.log); // [1, 2, 3] (after about 2 seconds)
 */
const collectInto = fn => (...args) => fn(args);

/**
 * Flip以一个函数作为参数，然后把第一个参数作为最后一个参数。
 * 返回一个可变参数的闭包，在应用其他参数前，先把第一个以外的其他参数作为第一个参数。
 * demo
 *  let a = { name: 'John Smith' };
    let b = {};
    const mergeFrom = flip(Object.assign);
    let mergePerson = mergeFrom.bind(null, a);
    mergePerson(b); // == b
    b = {};
    Object.assign(b, a); // == b
 */
const flip = fn => (first, ...rest) => fn(...rest, first);

/**
 * 创建一个函数，这个函数可以调用每一个被传入的并且才有参数的函数，然后返回结果。
   使用 Array.prototype.map() 和 Function.prototype.apply()将每个函数应用给定的参数。
   适用于多个函数同时对同一数据源处理
   demo
    const minMax = over(Math.min, Math.max);
    minMax(1, 2, 3, 4, 5); // [1,5]
 */
const over = (...fns) => (...args) => fns.map(fn => fn.apply(null, args));

/**
 *  创建一个函数，它可以调用提供的被转换参数的函数。可用于参数处理
    使用Array.prototype.map()将transforms应用于args，并结合扩展运算符(…)将转换后的参数传递给fn。
    demo
    const square = n => n * n;
    const double = n => n * 2;
    const fn = overArgs((x, y) => [x, y], [square, double]);
    fn(9, 3); // [81, 6]
 */
const overArgs = (fn, transforms) => (...args) => fn(...args.map((val, i) => transforms[i](val)));

/**
 * 为异步函数执行从左到右的函数组合。
    Promise 和 reduce 的组合非常巧妙
    在扩展操作符(…)中使用Array.prototype.reduce() 来使用Promise.then()执行从左到右的函数组合。 
    这些函数可以返回简单值、Promise的组合，也可以定义为通过await返回的async值。 所有函数必须是一元的。
    demo
    const sum = pipeAsyncFunctions(
        x => x + 1,
        x => new Promise(resolve => setTimeout(() => resolve(x + 2), 1000)),
        x => x + 3,
        async x => (await x) + 4
    );
    (async() => {
        console.log(await sum(5)); // 15 (after one second)
    })();
 */
const pipeAsyncFunctions = (...fns) => arg => {
    fns.reduce((p, f) => {
        return p.then(f)
    }, Promise.resolve(arg))
};

/**
 * 执行从左到右的函数组合。类似于 compose
 */
const pipeFunctions = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

/**
 * 把一个异步函数转换成返回promise的。非常实用
   使用局部套用返回一个函数，该函数返回一个调用原始函数的Promise。 使用的...操作符来传入所有参数。
 */
const promisify = func => (...args) =>
    new Promise((resolve, reject) => {
        return func(...args, (err, result) => (err ? reject(err) : resolve(result)))
    }
    );

/**
 * 接受一个可变参数函数并返回一个闭包，该闭包接受一个参数数组以映射到函数的输入。
 */
const spreadOver = fn => argsArr => fn(...argsArr);


exports = {
    ary
}