const http = require('http');
// 先封装request和response，然后再组装成context
const request = require('./request');
const response = require('./response');
const context = require('./context');

/**
 * 实现KOA
 * 1. KOA: 洋葱模型、context
 * 2. 实现一些中间件: router、static、
 */
class MyKoa {
  constructor() {
    this.middlewares = [];
  }
  createContext(req, res) {
    // 绑定原型
    const ctx = Object.create(context);
    ctx.request = Object.create(request);
    ctx.response = Object.create(response);
    ctx.req = ctx.request.req = req;
    ctx.res = ctx.response.res = res;
    return ctx;
  }
  listen(...args) {
    const server = http.createServer(async (req, res) => {
      const ctx = this.createContext(req, res);
      const func = this.compose(this.middlewares);
      await func(ctx);
      res.end(ctx.body);
    });
    server.listen(...args);
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  compose(midllewares) {
    // 书读百遍 其义自现：算法的核心是循环体的设计，是把复杂逻辑中的关键逻辑抽取出来，是能够一眼看破组织结构，是能够快速联想到模型，生活模型、游戏模型、数学模型
    return ctx => {
      const dispatch = index => {
        const middleware = midllewares[index];
        return middleware
          ? middleware(ctx, () => dispatch(index + 1))
          : Promise.resolve();
      };
      return dispatch(0);
    };
  }
}

module.exports = MyKoa;
