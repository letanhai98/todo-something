const addZeroBefore = (n) => {
    return (n < 10 ? '0' : '') + n;
  };
  
  const generateTime = () => {
    let current_datetime = new Date();
  
    return addZeroBefore(current_datetime.getFullYear()) +
      '-' +
      addZeroBefore(current_datetime.getMonth() + 1) +
      '-' +
      addZeroBefore(current_datetime.getDate()) +
      ' ' +
      addZeroBefore(current_datetime.getHours()) +
      ':' +
      addZeroBefore(current_datetime.getMinutes()) +
      ':' +
      addZeroBefore(current_datetime.getSeconds());
  }
  
  export const customLogger = (req, res, next) => {
  
    let formatted_date = generateTime();
      
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
  
    const cloneBody = JSON.parse(JSON.stringify(req.body));
    const cloneParams = JSON.parse(JSON.stringify(req.params));
    const cloneQuery = JSON.parse(JSON.stringify(req.query));
    delete cloneBody.password;
  
    let log = `[${formatted_date}] ${method}:${url} ${status}`;
  
    var oldWrite = res.write,
      oldEnd = res.end;
  
    var chunks = [];
  
    res.write = function (chunk) {
      chunks.push(chunk);
  
      return oldWrite.apply(res, arguments);
    };
  
    res.end = function (chunk) {
      if (chunk) chunks.push(chunk);
  
      var body = Buffer.concat(chunks).toString('utf8');
      console.log(
        log,
        Object.keys(cloneBody).length > 0
          ? `\n[BODY]: ${JSON.stringify(cloneBody)}`
          : '',
        Object.keys(cloneParams).length > 0
          ? `\n[PARAMS]: ${JSON.stringify(cloneParams)}`
          : '',
        Object.keys(cloneQuery).length > 0
          ? `\n[QUERY]: ${JSON.stringify(cloneQuery)}`
          : '',
        Object.keys(body).length > 0 ? `\n[RESPONSE]: ${body}` : ''
      );
  
      oldEnd.apply(res, arguments);
    };
  
    next();
  };
  