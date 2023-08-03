export const validation = (schema) => {
    return (req, res, next) => {
        const data1 = { ...req.body, ...req.params }
        const { authorization } = req.headers
        let data2 = data1;
        if (authorization) {
            data2 = { ...data1, authorization };
        }
        const validationResult = schema.validate(data2, { abortEarly: false });
        if (validationResult.error) {
            return res.json({ massage: "Validation Error", validationError: validationResult.error.details })
        }
        return next()
    }
}