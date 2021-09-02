const router = require("express").Router();
const Passing = require("../models/Passing");
const verify = require('./verifyToken');
const utils = require('../utils');

//* Получение списка прохождений теста
router.get('/', verify, async (req, res) => {
    try {
        Passing.find({ deleted: false, isEnded: true }, (error, obj) => {
            if (error) {
                console.error(error);
                return res.status(400).send({ error });
            }
            let passingTest = [];
            let passingUser = [];
            obj.forEach((el, index) => {
                if (el.testbank != null) {
                    if (el.testbank.user._id == req.user._id) {
                        passingTest.push(obj[index]);
                    }
                    if (el.user._id == req.user._id) {
                        passingUser.push(obj[index]);
                    }
                }
            })
            res.send({ passingUser, passingTest });
        }).populate([
            {
                path: 'testbank',
                model: 'Testbank',
                select: 'name user resultAfterTesting',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'name'
                }
            },
        ]).populate({ path: 'user', select: 'name' }).lean();
    } catch (err) {
        console.error(err);
    }
});

//* Получение списка моих прохождений теста
router.get('/my-passing', verify, async (req, res) => {
    try {
        Passing.find({ deleted: false, user: req.user._id }, (error, myPassing) => {
            if (error) {
                console.error(error);
                return res.status(400).send({ error });
            }
            res.send({ myPassing });
        }).populate([
            {
                path: 'testbank',
                model: 'Testbank',
                select: 'name user link',
                populate: {
                    path: 'user',
                    model: 'User',
                    select: 'name'
                }
            },
        ]).populate({ path: 'user', select: 'name' }).lean();
    } catch (err) {
        console.error(err);
    }
});

//* Нажатие на кнопку "ГОТОВО" при прохождении теста
router.post('/', verify, async (req, res) => {
    try {
        let qna = req.body.data.qna;
        const passing = await Passing.findOne({ user: req.user._id, _id: req.body.data.passing._id, deleted: false });
        if (passing != null) {
            qna.forEach((quest) => {
                delete quest.questionName;
                quest.answers.forEach((answer) => {
                    delete answer.text;
                })
            })
            passing.endedAt = Date.now();
            passing.isEnded = true;
            passing.qna = qna;

            await passing.save().then(async (passing, error) => {
                if (error) res.status(400).send({ error });
                try {
                    const obj = await Passing.findOne({ _id: req.body.data.passing._id }).populate('qna.question');

                    let questionLength = obj.qna.length;
                    let questionsUser = [];
                    let questionsBase = [];
                    obj.qna.forEach((item, index) => {
                        questionsUser.push({ answers: item.answers, type: qna[index].questionType });
                        questionsBase.push(item.question.answers);
                    })

                    let countWrongAnswer = utils.countWrongAnswer(questionsUser, questionsBase);

                    //* Подсчет результатов прохождения теста
                    obj.countWrongAnswers = countWrongAnswer;
                    obj.resultPercent = 100 - ((countWrongAnswer / questionLength * 100)).toFixed(2);
                    obj.answersCount = questionLength;
                    //* Сохранение изменений в БД
                    await obj.save().then((newObj, error) => {
                        if (error) res.status(400).send({ error });
                        else res.send({ newObj });
                    })

                } catch (err) {
                    console.error(err);
                }

            })
        }
        else {
            res.status(400).send({ errors: ["Прохождение не найдено"] });
        }
    } catch (err) {
        console.error(err);
    }
});
module.exports = router;