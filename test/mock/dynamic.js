
// 为了兼容之前老的mockData

const path = require('path');

module.exports = function (req, res, next) {
  let mockData;
  // get filePath
  let filePath = path.join('../mock', req.originalPath);
  
  try {
    delete require.cache[require.resolve(filePath)];
    // 需要执行一下，主要是之前的写法返回的是一个函数，且有个req参数
    mockData = require(filePath)(req);
  } catch (err) {
    next(err);
  }
  
  res.header('x-api-mock-path', require.resolve(filePath));
  res.send(mockData);
};
