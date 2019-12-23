const path = require('path');
const fs = require('fs');
// 接受一个路径 返回一个中间件
module.exports = (dirPath = './public') => async (ctx, next) => {
  const base = path.resolve(__dirname, dirPath);
  const filePath = path.join(base, ctx.url);
  if (fs.existsSync(filePath)) {
    ctx.res.setHeader('Content-Type', 'text/html');
    ctx.body = fs.readFileSync(filePath);
    return;
  }
  await next();
};
