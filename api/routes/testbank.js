const router = require("express").Router();
const Testbank = require("../models/Testbank");
const Passing = require("../models/Passing");
const verify = require('./verifyToken');
const { v4: uuidv4 } = require('uuid');
const { testbankValidation } = require("../validations/testbank");

//* Получение списка всех тестов
router.get('/', verify, (req, res) => {
    try {
        Testbank.find({ deleted: false, user: req.user._id }, (err, obj) => {
            if (err) console.log(err);
            res.send({ testbank: obj });
        }).lean();
    } catch (err) {
        console.log(err);
    }
});

//* Получение теста по id
router.get('/:id', verify, (req, res) => {
    try {
        Testbank.findOne({ _id: req.params.id, deleted: false, user: req.user._id }, (err, obj) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ errors: ["Тест не найден"] })
            };
            res.send({ testbank: obj });
        }).lean();
    } catch (err) {
        console.log(err);
    }
});

//* Получение текущего результата прохождения теста
router.get('/run/:link/current-result', verify, (req, res) => {
    try {
        Testbank.findOne({ link: req.params.link, deleted: false, isOpen: true }, (err, testbank) => {
            if (err) {
                console.log(err);
            }
            else {
                if (testbank != null) {
                    Passing.findOne({ deleted: false, testbank: testbank._id, user: req.user._id }, (err, passing) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).send({ errors: ["Прохождение не найдено"] })
                        }
                        if (passing != null) {
                            let wrong = passing.countWrongAnswers;
                            let right = passing.answersCount - passing.countWrongAnswers;
                            let result = passing.resultPercent;
                            passing.qna.forEach(el => {
                                el.answers.forEach(function (item) {
                                    delete item._id;
                                    delete item.id;
                                });
                            })
                            res.send({ result, wrong, right, passing, testbank });
                        }
                        else {
                            res.status(400).send({ errors: ['Прохождение не найдено'] })
                        }
                    })
                        .populate({ path: 'qna.question', select: 'answers' }).populate('qna.question', '-answers._id').lean();
                }
            }
        }).populate('testbank').lean();
    } catch (err) {
        console.log(err);
    }
});

//* Получение тестов по ссылке для ПРОХОЖДЕНИЯ
router.get('/run/:link', verify, async (req, res) => {
    try {
        const testbank = await Testbank.findOne({
            link: req.params.link,
            deleted: false,
            isOpen: true
        }).populate('questions', '-answers.isCorrect').lean();
        if (testbank != null) {

            const passing = await Passing.findOne({
                user: req.user._id,
                testbank: testbank._id,
                deleted: false
            }).lean();
            if (passing) {
                if (!passing.isEnded) {
                    Passing.findOneAndRemove({ _id: passing._id }, function (error) {
                        if (error) return res.status(400).send({ error });
                    });
                }
                else {
                    return res.status(400).send({ errors: ["Вы уже прошли этот тест"] });
                }
            }

            const newPassing = new Passing({
                user: req.user._id,
                testbank: testbank._id,
            });
            await newPassing.save().then((newPassing, error) => {
                if (error) return res.send({ error })
                else res.send({ testbank: testbank, passing: newPassing });
            });
        } else {
            return res.status(400).send({ errors: ["Тест недоступен для прохождения"] });
        }
    }
    catch (err) {
        console.log(err);
    }
});

//* Добавление теста 
router.post('/', verify, async (req, res) => {
    try {
        //* Валидация данных для добавления теста
        const { error } = testbankValidation(req.body.testbank);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }

        //* Проверка на существование теста с таким названием
        const checkTestbank = await Testbank.findOne({ name: req.body.testbank.name.trim(), deleted: false, user: req.user._id });
        if (checkTestbank) return res.status(400).send({ errors: ["Тест с таким названием уже добавлен"] });

        const testbank = new Testbank({
            name: req.body.testbank.name,
            questions: req.body.testbank.questions,
            user: req.user._id,
            resultAfterTesting: req.body.testbank.resultAfterTesting,
            isOpen: req.body.testbank.isOpen,
            link: uuidv4()
        });

        //* Сохранение изменений в БД
        await testbank.save().then((testbank, error) => {
            if (error) return res.status(400).send({ error })
            else res.send({ testbank });
        });
    } catch (err) {
        console.log(err);
    }
});

//* Удаление теста
router.delete('/:id', verify, async (req, res) => {
    try {
        const testbank = await Testbank.findOne({ deleted: false, _id: req.params.id, user: req.user._id });
        //* Поиск прохождений теста
        const passing = await Passing.findOne({ deleted: false, testbank: req.params.id });
        if (testbank != null) {
            if (passing == null) {
                testbank.deleted = true;
                //* Сохранение изменений в БД
                await testbank.save().then((obj, error) => {
                    if (error) {
                        console.log(error);
                        res.status(400).send({ error });
                    }
                    res.send(`Тест с id ${req.params.id} удален`);
                })
            } else {
                res.status(400).send({ errors: ['Нельзя удалить тест, который кто-либо прошел'] });
            }
        }
        else {
            res.status(400).send({ errors: ['Тест не найден'] });
        }
    } catch (err) {
        console.log(err);
    }
});

//* Изменение теста
router.put('/:id', verify, async (req, res) => {
    try {
        //* Валидация данных для изменения теста
        const { error } = testbankValidation(req.body.testbank);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }

        //* Проверка на существование теста с таким названием
        const checkTestbank = await Testbank.findOne({ name: req.body.testbank.name.trim(), deleted: false, user: req.user._id });
        if (checkTestbank) {
            if (checkTestbank._id != req.params.id)
                return res.status(400).send({ errors: ["Тест с таким названием уже добавлен"] });
        }


        const testbank = await Testbank.findOne({ _id: req.params.id, deleted: false, user: req.user._id });
        if (testbank != null) {
            testbank.name = req.body.testbank.name;
            testbank.questions = req.body.testbank.questions;
            testbank.isOpen = req.body.testbank.isOpen;
            testbank.resultAfterTesting = req.body.testbank.resultAfterTesting;

            //* Сохранение изменений в БД
            await testbank.save().then((testbank, err) => {
                if (err) return res.status(400).send({ err })
                res.send({ testbank });
            });
        }
        else {
            res.status(400).send({ errors: ['Тест не найден'] });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;