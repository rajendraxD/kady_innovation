export const validate = (schema, location = 'body') => {
  return async (req, res, next) => {
    if (!schema) return next();
    try {
      const validated = await schema.validate(req[location], {
        abortEarly: false,
        stripUnknown: true
      });
      req[location] = validated;
      next();
    } catch (err) {
      err.statusCode = 422;
      err.message = 'Validation failed';
      next(err);
    }
  };
};
