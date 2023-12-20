const setDBInRequest = async (req, res, next) => {
    const db = req.context.db; // Retrieve the db object from the request context
    req.context.db = db; // Add the db object to the request context
    next();
  };
  
  export default setDBInRequest;s