const errorHandler = (error, req, res, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
  
    next(error)//error lähetetään eteenpäin jos se ei ole CastError Expressin oletus virheenkäisttelijälle
  };
  
  module.exports = errorHandler;
  