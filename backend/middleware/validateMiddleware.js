const validateMiddleware = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = {};
        error.details.forEach((detail) => {
            errors[detail.path[0]] = detail.message.replace(/"/g, "");
        });
        return res.status(400).json({ errors });
    }
    next();
};

export default validateMiddleware;