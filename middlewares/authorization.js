const authorization = (role) => (req, res, next) => {
    console.log(role);
    next();
  };
  
  export { authorization };
  