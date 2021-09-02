const router = require("express").Router();
const Passing = require("../models/Passing");
const verify = require('./verifyToken');

//* Получение прохождения  по id
router.get('/:id', verify, (req, res) => {
    try {
        Passing.find({ testbank: req.params.id, isEnded: true, deleted: false }, (err, obj) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ errors: ["Тест не найден"] })
            }
            let percents = [];
            let labels = [];
            obj.forEach((el) => {
                if (el.testbank != null && el.testbank.user._id.toString() == req.user._id.toString()) {
                    labels.push(el.user.name);
                    percents.push(el.resultPercent.toFixed(2));
                }
            })
            if (percents.length > 0 && labels.length > 0) {
                res.send({ labels, percents });
            }
            else {
                res.status(400).send({ errors: ["Результаты по данному тесту не найдены"] })
            }
        }).populate([
            {
                path: 'testbank',
                model: 'Testbank',
                select: 'user',
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

module.exports = router;