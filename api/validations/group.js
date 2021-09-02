const Joi = require("joi");

//* Валидация данных при создании группы
const groupCreateValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required().messages({
            'string.base': `Группа должна быть текстовой строкой`,
            'string.empty': `Группа не должна быть пустой`,
            'string.min': `Группа не может быть короче {#limit} символов`,
            'string.max': `Группа не может быть больше {#limit} символов`,
            'any.required': `Группа является обязательным полем`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(data);
};

module.exports.groupCreateValidation = groupCreateValidation;
