const Joi = require("joi");

//* Валидация данных при регистрации пользователя 
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
      'string.base': `Имя пользователя должен быть текстовой строкой`,
      'string.empty': `Имя пользователя не должно быть пустым`,
      'string.min': `Имя пользователя не может быть короче {#limit} символов`,
      'string.max': `Имя пользователя не может быть больше {#limit} символов`,
      'any.required': `Имя пользователя является обязательным полем`,
    }),
    email: Joi.string().min(6).max(255).required().email().messages({
      'string.base': `Email должен быть текстовой строкой`,
      'string.empty': `Email не должен быть пустым`,
      'string.min': `Email не может быть короче {#limit} символов`,
      'string.max': `Email не может быть больше {#limit} символов`,
      'any.required': `Email является обязательным полем`,
      'string.email': `Email не валиден`
    }),
    password1: Joi.string().min(6).max(1024).required().messages({
      'string.base': `Пароль должен быть текстовой строкой`,
      'string.empty': `Пароль не должен быть пустым`,
      'string.min': `Пароль не может быть короче {#limit} символов`,
      'string.max': `Пароль не может быть больше {#limit} символов`,
      'any.required': `Пароль является обязательным полем`,
      'any.invalid': `Пароль не валиден`
    }),
    // password2: Joi.ref('password1').error(new Error("Пароли должны совпадать")),
    password2: Joi.string().required().valid(Joi.ref('password1')).messages({ 'any.only': 'Пароли должны совпадать' }),
    conditions: Joi.boolean().valid(true).messages({
      'any.only': 'Необходимо согласиться с условиями'
    })
  }).options({ abortEarly: false });
  return schema.validate(data);
};

//* Валидация данных при авторизации пользователя
const loginValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).messages({
      'string.base': `Имя пользователя должен быть текстовой строкой`,
      'string.empty': `Имя пользователя не должно быть пустым`,
      'string.min': `Имя пользователя не может быть короче {#limit} символов`,
      'string.max': `Имя пользователя не может быть больше {#limit} символов`,
    }),
    email: Joi.string().min(6).max(255).required().email().messages({
      'string.base': `Email должен быть текстовой строкой`,
      'string.empty': `Email не должен быть пустым`,
      'string.min': `Email не может быть короче {#limit} символов`,
      'string.max': `Email не может быть больше {#limit} символов`,
      'any.required': `Email является обязательным полем`,
      'string.email': `Email не валиден`
    }),
    password: Joi.string().required().messages({
      'string.base': `Пароль должен быть текстовой строкой`,
      'string.empty': `Пароль не должен быть пустым`,
      'any.required': `Пароль является обязательным полем`,
    }),
    g: Joi.boolean()
  }).options({ abortEarly: false });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
