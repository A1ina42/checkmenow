const router = require("express").Router();
const Category = require("../models/Category");
const Question = require("../models/questions/Question");
const verify = require('./verifyToken');
const { categoryCreateValidation, categoryUpdateValidation } = require("../validations/category");

//* Получение списка всех категорий
router.get('/', verify, (req, res) => {
    try {
        Category.find({ deleted: false, user: req.user._id }, (err, obj) => {
            if (err) console.error(err);
            res.send({ category: obj });
        }).lean();
    } catch (err) {
        console.error(err);
    }
});

//* Добавление категории
router.post('/', verify, async (req, res) => {
    try {
        //* Валидация данных для добавления категории
        const { error } = categoryCreateValidation(req.body.category);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }

        //* Проверка на существование категории с таким же названием
        const checkCategory = await Category.findOne({ name: req.body.category.name.trim(), deleted: false, user: req.user._id });
        if (checkCategory) return res.status(400).send({ errors: ["Категория с таким названием уже добавлена"] });

        const category = new Category({
            name: req.body.category.name,
            user: req.user._id,
        });

        //* Сохранение изменений в БД
        await category.save().then((category, error) => {
            if (error) return res.status(400).send({ error })
            else res.send({ category });
        });
    } catch (err) {
        console.error(err);
    }
});

//* Удаление категории
router.delete('/:id', verify, async (req, res) => {
    try {
        //* Поиск вопросов, относящихся к категории
        const question = await Question.find({ deleted: false, category: req.params.id, user: req.user._id });
        if (question.length == 0) {
            const category = await Category.findOne({ _id: req.params.id, deleted: false, user: req.user._id });
            if (category != null) {
                category.deleted = true;
                //* Сохранение изменений в БД
                await category.save().then((obj, errors) => {
                    if (errors) {
                        console.error(errors);
                        res.status(400).send({ errors });
                    }
                    res.send(`Категория с id ${req.params.id} удалена`);
                })
            }
            else {
                res.status(400).send({ errors: ['Категория не найдена'] });
            }
        }
        else {
            res.status(400).send({ errors: ['Нельзя удалить категорию, в которой находится хотя бы 1 вопрос'] });
        }
    } catch (err) {
        console.error(err);
    }
});

//* Изменение категории
router.put('/', verify, async (req, res) => {
    try {
        //* Валидация данных для изменения категории
        const { error } = categoryUpdateValidation(req.body.category);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }

        //* Проверка на существование категории с таким же названием
        const checkCategory = await Category.findOne({ name: req.body.category.name.trim(), deleted: false, user: req.user._id });
        if (checkCategory) {
            if (checkCategory._id != req.params.id)
                return res.status(400).send({ errors: ["Категория с таким названием уже добавлена"] });
        }

        const category = await Category.findOne({ _id: req.body.category.id, deleted: false, user: req.user._id });
        if (category != null) {
            category.name = req.body.category.name;
            //* Сохранение изменений в БД
            await category.save().then((category, err) => {
                if (err) return res.status(400).send({ err })
                res.send({ category });
            });
        }
        else {
            res.status(400).send({ errors: ['Категория не найдена'] });
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;