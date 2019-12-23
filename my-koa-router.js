class MyKoaRouter {
  constructor() {
    this.stacks = [];
  }
  register(path, method, middleware) {
    const route = { path, method, middleware };
    this.stacks.push(route);
  }
  get(path, middleware) {
    this.register(path, 'get', middleware);
  }
  post(path, middleware) {
    this.register(path, 'post', middleware);
  }
  // 返回的是一个koa的中间件
  routes() {
    const useRoute = async (ctx, next) => {
      const { url, method } = ctx;

      const route = this.stacks.find(
        route => route.path === url && route.method === method
      );
      if (!route) {
        await next();
        return;
      }
      const { middleware } = route;
      if (typeof middleware !== 'function') {
        await next();
        return;
      }
      await middleware(ctx, next);
    };
    return useRoute;
  }
}

module.exports = MyKoaRouter;
