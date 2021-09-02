const router = require("express").Router();
const Group = require("../models/Group");
const Testbank = require("../models/Testbank");
const verify = require('./verifyToken');
const { groupCreateValidation } = require("../validations/group");
const User = require("../models/User");

//* Получение списка всех групп
router.get('/', verify, (req, res) => {
    try {
        Group.find({ deleted: false, owner: req.user._id }, (errors, obj) => {
            if (errors) {
                console.error(errors);
                return res.status(400).send({ errors });
            }
            res.send({ group: obj });
        }).populate({ path: 'members.user', select: 'name' }).lean();
    } catch (err) {
        console.error(err);
    }
});

//* Список приглашений в группу
router.get('/my-groups', verify, (req, res) => {
    try {
        Group.find({ deleted: false }, (err, group) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ errors: ["Группа не найдена"] });
            }
            let invites = [];
            let myGroups = [];
            group.forEach((item) => {
                let invite = item.members.filter(member => {
                    return member.user._id == req.user._id
                });
                if (invite != null && invite.length > 0) {
                    if (invite[0].isAccepted == false) {
                        invites.push(item);
                    }
                    else {
                        myGroups.push(item);
                    }
                }
            });
            res.send({ invites, myGroups });
        }).populate({ path: 'members.user', select: 'name' }).populate('testbanks').populate({ path: 'owner', select: 'name' });
    } catch (err) {
        console.error(err);
    }
});

//* Принятие приглашения в группу
router.get('/my-groups/:id', verify, (req, res) => {
    try {
        Group.findOne({ deleted: false, _id: req.params.id }, (err, group) => {
            if (err && group == null) {
                return res.status(400).send({ errors: ["Группа не найдена"] });
            }
            else {
                group.members.forEach((item) => {
                    if (item.user._id.toString() === req.user._id.toString()) {
                        item.isAccepted = true;
                    }
                });
                //* Сохранение изменений в БД
                group.save().then((group, errors) => {
                    if (errors) {
                        console.error(errors);
                        return res.status(400).send({ errors });
                    }
                    res.send({ group });
                });
            }
        }).populate({ path: 'members.user', select: 'name' }).populate('testbanks').populate({ path: 'owner', select: 'name' });
    } catch (err) {
        console.error(err);
    }
});

//* Удаление себя из группы
router.delete('/my-groups/:id', verify, (req, res) => {
    try {
        Group.findOne({ deleted: false, _id: req.params.id }, (err, group) => {
            if (err && group == null) {
                console.error(err);
                return res.status(400).send({ errors: ["Группа не найдена"] });
            }
            else {
                let index = group.members ? group.members.findIndex(x => x.user._id.toString() == req.user._id.toString()) : -1;
                if (index !== -1) {
                    group.members.splice(index, 1);
                    //* Сохранение изменений в БД
                    group.save().then((group, errors) => {
                        if (errors) {
                            console.error(errors);
                            return res.status(400).send({ errors });
                        }
                        res.send({ group });
                    });
                }
            }
        }).populate({ path: 'members.user', select: 'name' }).populate('testbanks').populate({ path: 'owner', select: 'name' });
    }
    catch (err) {
        console.error(err);
    }
});

//* Добавление группы
router.post('/', verify, async (req, res) => {
    try {
        //* Валидация данных для добавления группы
        const { error } = groupCreateValidation(req.body.group);
        if (error) {
            let mas = [];
            for (let i = 0; i < error.details.length; i++) {
                mas.push(error.details[i].message);
            }
            mas = [...new Set(mas)];
            return res.status(400).send({ errors: mas });
        }
        //* Проверка на существование группы с таким же названием
        const checkGroup = await Group.findOne({ name: req.body.group.name.trim(), deleted: false, owner: req.user._id });
        if (checkGroup) return res.status(400).send({ errors: ["Группа с таким названием уже добавлена"] });

        const group = new Group({
            name: req.body.group.name,
            owner: req.user._id,
        });

        //* Сохранение изменений в БД
        await group.save().then((group, errors) => {
            if (errors) {
                console.error(errors);
                return res.status(400).send({ errors });
            }
            res.send({ group });
        });
    } catch (err) {
        console.error(err);
    }
});

//* Добавление теста группе
router.post('/testbank/add/:id', verify, async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.id, owner: req.user._id });
        if (group != null) {
            group.testbanks.push(req.body.testbanks);
            //* Сохранение изменений в БД
            group.save().then((obj, errors) => {
                if (errors) {
                    console.error(errors);
                    return res.status(400).send({ errors });
                }
                res.send(obj)
            });
        }
        else {
            return res.status(400).send({ errors: ['Группа не найдена'] });
        }
    } catch (err) {
        console.error(err);
    }
});

//* Добавление пользователей в группу
router.post('/user/add/:id', verify, async (req, res) => {
    try {
        //* Поиск группы по id
        const group = await Group.findOne({ _id: req.params.id, owner: req.user._id });
        if (group != null) {
            //* Получение пользователей из БД
            User.find({ deleted: false }, (errors, obj) => {
                if (errors) {
                    console.error(errors);
                    return res.status(400).send({ errors });
                }

                let usersDb = []; //Имена существующих в БД пользователей
                let newAddUsers = []; //Имена только что добавленных пользоваетелей в БД

                //* Перебор всех пользователей в БД
                obj.forEach((el) => {

                    //* Получение существующих в БД пользователей из полученного с фронтенда списка
                    if (req.body.users.includes(el.name)) {
                        usersDb.push(el.name); //Добавление существующих в БД пользователей

                        //* Проверка, добавлен ли уже такой пользователь в группу
                        if (!group.members.some(e => e.user.toString() == el._id.toString())) {

                            //* Если нет, то добавляем его в группу
                            newAddUsers.push(el.name);
                            group.members.push({ user: el._id });
                        }
                    }
                })

                //* Сохранение изменений в БД
                group.save().then((obj, errors) => {
                    if (errors) {
                        console.error(errors);
                        return res.status(400).send({ errors });
                    }
                });

                //* Поиск не существующих имен в БД
                let diff = req.body.users.filter(n => usersDb.indexOf(n) === -1);
                let notExist = [];
                if (diff.length > 0) {
                    notExist.push("Не существует: " + diff.join(', '));
                }

                //* Отправка на фронтенд массива имен только что добавленных пользователей, 
                //* и массив имен не найденных в БД
                res.send({ newAddUsers, notExist })
            }).lean();
        }
        else {
            return res.status(400).send({ errors: ['Группа не найдена'] });
        }
    } catch (err) {
        console.error(err);
    }
});


//* Получение списка всех тестов и тестов группы
router.get('/testbank/:id', verify, (req, res) => {
    try {
        Group.findOne({ _id: req.params.id, owner: req.user._id }, (err, group) => {
            if (err) {
                console.error(err);
                return res.status(400).send({ errors: ["Группа не найдена"] });
            }
            if (group != null) {
                Testbank.find({ deleted: false, user: req.user._id }, (err, testbank) => {
                    if (err) {
                        console.error(err);
                        res.status(400).send({ errors: ["Тест не найден"] });
                    }
                    if (testbank != null) {
                        let groupTestbank = group.testbanks;
                        let allTestbank = testbank;
                        res.send({ allTestbank, groupTestbank });
                    }
                    else {
                        res.status(400).send({ errors: ["Тест не найден"] });
                    }
                }).lean();
            }
            else {
                res.status(400).send({ errors: ["Группа не найдена"] });
            }
        }).lean();
    } catch (err) {
        console.error(err);
    }
});


//* Удаление пользователя из группы
router.delete('/:groupId/user/:userId', verify, async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.groupId, deleted: false, owner: req.user._id });
        if (group != null) {
            group.members.pull({ _id: req.params.userId })
            // //* Сохранение изменений в БД
            await group.save().then((obj, errors) => {
                if (errors) {
                    console.error(errors);
                    return res.status(400).send({ errors });
                }
                res.send(`Пользователь с id ${req.params.userId} удален`);
            })
        }
        else {
            return res.status(400).send({ errors: ['Группа не найдена'] });
        }
    } catch (err) {
        console.error(err);
    }
});

//* Удаление группы
router.delete('/:id', verify, async (req, res) => {
    try {
        const group = await Group.findOne({ _id: req.params.id, deleted: false, owner: req.user._id });
        if (group != null) {
            group.deleted = true;
            //* Сохранение изменений в БД
            await group.save().then((obj, errors) => {
                if (errors) {
                    console.error(errors);
                    return res.status(400).send({ errors });
                }
                res.send(`Группа с id ${req.params.id} удалена`);
            })
        }
        else {
            return res.status(400).send({ errors: ['Группа не найдена'] });
        }
    } catch (err) {
        console.error(err);
    }
});

//* Изменение группы
router.put('/', verify, async (req, res) => {
    try {
        //* Проверка на существование группы с таким же названием
        const checkGroup = await Group.findOne({ name: req.body.group.name.trim(), deleted: false, owner: req.user._id });
        if (checkGroup) {
            if (checkGroup._id != req.params.id)
                return res.status(400).send({ errors: ["Группа с таким названием уже добавлена"] });
        }

        const group = await Group.findOne({ _id: req.body.group.id, deleted: false, owner: req.user._id });
        if (group != null) {
            group.name = req.body.group.name;
            //* Сохранение изменений в БД
            await group.save().then((group, errors) => {
                if (errors) return res.status(400).send({ errors })
                res.send({ group });
            });
        }
        else {
            return res.status(400).send({ errors: ['Группа не найдена'] });
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;