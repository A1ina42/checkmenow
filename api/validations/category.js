const Joi = require("joi");

//* Валидация данных при создании категории
const categoryCreateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required().messages({
            'string.base': `Категория должна быть текстовой строкой`,
            'string.empty': `Категория не должна быть пустой`,
            'string.min': `Категория не может быть короче {#limit} символов`,
            'string.max': `Категория не может быть больше {#limit} символов`,
            'any.required': `Категория является обязательным полем`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(data);
};

//* Валидация данных при изменении категории
const categoryUpdateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required().messages({
            'string.base': `Категория должна быть текстовой строкой`,
            'string.empty': `Категория не должна быть пустой`,
            'string.min': `Категория не может быть короче {#limit} символов`,
            'string.max': `Категория не может быть больше {#limit} символов`,
            'any.required': `Категория является обязательным полем`,
        }),
        id: Joi.string().required().messages({
            'any.required': `Необходимо выбрать категорию`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(data);
};

module.exports.categoryCreateValidation = categoryCreateValidation;
module.exports.categoryUpdateValidation = categoryUpdateValidation;
