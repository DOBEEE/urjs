// class ExtensibleError {}

// function ExtendableErrorBuiltin() {
//  function ExtendableBuiltin() {
//      Error.apply(this, arguments);

//      // Set this.message
//      Object.defineProperty(this, 'message', {
//          configurable: true,
//          enumerable: false,
//          value: arguments.length ? String(arguments[0]) : ''
//      })

//      // Set this.name
//      Object.defineProperty(this, 'name', {
//          configurable: true,
//          enumerable: false,
//          value: this.constructor.name
//      })

//      if (typeof Error.captureStackTrace === 'function') {
//          // Set this.stack
//          Error.captureStackTrace(this, this.constructor)
//      }
//  }
//  ExtendableBuiltin.prototype = Object.create(Error.prototype);
//  Object.setPrototypeOf(ExtendableBuiltin, Error);

//  return ExtendableBuiltin;
// }

// ExtensibleError = ExtendableErrorBuiltin(Error);

class NetException extends Error {
    constructor(msg) {
        super(msg);
        this.name = 'NetErr';
        this.msg = msg || '请求返回错误';
        Error.captureStackTrace(this, this.constructor);
    }
    toString() {
        return this.msg;
    }
}

function exception(e) {
    let msg = '请求返回错误';
    if (process.env.NODE_ENV === 'development') {
        msg = e.desc || msg;
    } else {
        msg = e.msg || msg;
    }
    return new NetException(msg);
}
export {
    exception,
    NetException
};
