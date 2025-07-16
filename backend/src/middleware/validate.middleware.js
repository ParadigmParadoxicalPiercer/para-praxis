import * as yup from "yup";

export const validateBody = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    next();
  } catch (err) {
    res.status(400).json({
      errors: err.inner
        ? err.inner.map((e) => ({ path: e.path, message: e.message }))
        : [{ message: err.message }],
    });
  }
};

export const updateSchema = yup.object({
  name: yup.string().optional(),
  email: yup.string().email().optional(),
  password: yup.string().min(6).optional(),
  bio: yup.string().max(500).optional(),
  profilePicture: yup.string().url().optional(),
  location: yup.string().max(100).optional(),
  website: yup.string().url().optional(),
});
