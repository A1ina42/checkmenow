const router = require("express").Router();
const User = require("../models/User");
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    try {
        const token = req.header('authorization');
        if (!token) res.status(401).send({ error: 'Неавторизован' });
        else {
            try {
                const verified = jwt.verify(token, process.env.TOKEN_SECRET);
                User.findOne({ _id: verified._id }, (err, obj) => {
                    if (err) console.error(err);
                    const newObj = Object.assign({}, obj);
                    newObj.token = token;
                    res.send({ user: newObj });
                }).lean();

            } catch (err) {
                res.status(400).send({ error: 'Недействительный токен' });
            }
        }
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;