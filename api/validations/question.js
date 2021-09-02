const Joi = require("joi");

//* Валидация данных при создании и изменении вопроса
const questionValidation = (data) => {
    const list = ["cb", "rb", "free"];
    const schema = Joi.object({
        category: Joi.string().min(1).required().messages({
            'any.required': `Необходимо выбрать категорию`,
            'string.empty': `Необходимо выбрать категорию`,
        }),
        name: Joi.string().min(1).required().messages({
            'string.base': `Текст вопроса должен быть текстовой строкой`,
            'string.empty': `Текст вопроса не должен быть пустым`,
            'string.min': `Текст вопроса не может быть короче {#limit} символов`,
            'any.required': `Текст вопроса является обязательным полем`,
        }),
        type: Joi.string().valid(...list).messages({
            'any.only': 'Тип может быть либо cb, либо rb, либо free'
        }),
        answers: Joi.array().items(
            Joi.object({
                text: Joi.string().required().min(1).messages({
                    'string.base': `Ответ должен быть текстовой строкой`,
                    'string.empty': `Ответ не должен быть пустым`,
                    'string.min': `Ответ не может быть короче {#limit} символов`,
                    'any.required': `Ответ является обязательным полем`,
                }),
                isCorrect: Joi.boolean().required().messages({
                    'any.required': `isCorrect не получен`,
                })
            }))
    }).options({ abortEarly: false });
    return schema.validate(data);
};

module.exports.questionValidation = questionValidation;
