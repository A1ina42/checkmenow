const router = require("express").Router();
const Question = require("../models/questions/Question");
const verify = require('./verifyToken');
const { questionValidation } = require("../validations/question");
const Testbank = require("../models/Testbank");

//* Получение списка всех вопросов
router.get('/', verify, (req, res) => {
    try {
        Question.find({ deleted: false, user: req.user._id }, (err, obj) => {
            if (err) console.error(err);
            res.send({ question: obj });
        }).lean();
    } catch (err) {
        console.error(err);
    }
});

//* Получение вопроса по id
router.get('/:id', verify, (req, res) => {
    try {
        Question.findOne({ _id: req.params.id, deleted: false, user: req.user._id }, { "answers._id": 0 }, (err, obj) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ errors: ["Вопрос не найден"] })
            }
            res.send({ question: obj });
        }).lean();
    } catch (err) {
        console.error(err);
    }
});

//* Добавление вопроса
router.post('/', verify, async (req, res) => {
    try {
        //* Валидация данных для добавления вопроса
        const { error } = questionValidation(req.body.question);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }

        //* Проверка на существование такого вопроса
        const checkQuestion = await Question.findOne({ name: req.body.question.name.trim(), deleted: false, user: req.user._id });
        if (checkQuestion) return res.status(400).send({ errors: ["Такой вопрос уже добавлен"] });

        const question = new Question({
            name: req.body.question.name,
            user: req.user._id,
            type: req.body.question.type,
            category: req.body.question.category,
            answers: req.body.question.answers
        });

        //* Сохранение изменений в БД
        await question.save().then((question, error) => {
            if (error) return res.status(400).send({ error })
            res.send({ question });
        });
    } catch (err) {
        console.error(err);
    }
});

//* Удаление вопроса
router.delete('/:id', verify, async (req, res) => {
    try {
        const question = await Question.findOne({ _id: req.params.id, deleted: false, user: req.user._id });
        if (question != null) {
            const testbanks = await Testbank.find({ deleted: false, user: req.user._id });
            let checkTestbank = null;
            testbanks.forEach((el) => {
                if (el.questions.includes(req.params.id)) {
                    checkTestbank = true;
                }
            })
            if (checkTestbank) {
                res.status(400).send({ errors: ["Нельзя удалить вопрос, который содержится в каком-либо тесте"] })
            }
            else {
                question.deleted = true;
                //* Сохранение изменений в БД
                await question.save().then((obj, errors) => {
                    if (errors) {
                        console.error(errors);
                        res.status(400).send({ errors });
                    }
                    res.send(`Вопрос с id ${req.params.id} удален`);
                })
            }
        }
        else {
            res.status(400).send({ error: 'Вопрос не найден' });
        }
    } catch (err) {
        console.error(err);
    }
});

//* Изменение вопроса
router.put('/:id', verify, async (req, res) => {
    try {
        //* Валидация данных для изменения вопроса
        const { error } = questionValidation(req.body.question);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }

        //* Проверка на существование такого вопроса
        const checkQuestion = await Question.findOne({ name: req.body.question.name.trim(), deleted: false, user: req.user._id });
        if (checkQuestion) {
            if (checkQuestion._id != req.params.id)
                return res.status(400).send({ errors: ["Такой вопрос уже добавлен"] });
        }

        const question = await Question.findOne({ _id: req.params.id, deleted: false, user: req.user._id });
        if (question != null) {
            question.name = req.body.question.name;
            question.answers = req.body.question.answers;
            question.category = req.body.question.category;
            //* Сохранение изменений в БД
            await question.save().then((question, err) => {
                if (err) return res.status(400).send({ err })
                res.send({ question });
            });
        }
        else {
            res.status(400).send({ error: 'Вопрос не найден' });
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;