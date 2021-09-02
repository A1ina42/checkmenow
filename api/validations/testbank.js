const Joi = require("joi");

//* Валидация данных при создании и изменении теста
const testbankValidation = (data) => {
    const list = ["dontShow", "show", "showAnswers"];
    const schema = Joi.object({
        name: Joi.string().min(1).required().messages({
            'string.base': `Название теста должно быть текстовой строкой`,
            'string.empty': `Название теста не должно быть пустым`,
            'string.min': `Название теста не может быть короче {#limit} символов`,
            'any.required': `Название теста является обязательным полем`,
        }),
        questions: Joi.array().items(
            Joi.string().required().messages({
                'string.required': `Необходимо выбрать вопрос`,
                'string.empty': `Необходимо выбрать вопрос`,
                'any.required': `Необходимо выбрать вопрос`
            })
        ).messages({
            'array.includesRequiredUnknowns': 'Необходимо выбрать вопрос'
        }),
        isOpen: Joi.boolean().required().messages({
            'any.required': `Статус не получен`,
        }),
        resultAfterTesting: Joi.string().valid(...list).messages({
            'any.only': 'Результат может быть либо dontShow, либо show, либо showAnswers'
        }),
    }).options({ abortEarly: false });
    return schema.validate(data);
};

module.exports.testbankValidation = testbankValidation;
