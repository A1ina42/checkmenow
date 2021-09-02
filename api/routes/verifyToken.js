const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.header('authorization');
        if (!token) return res.status(401).send({ error: 'Доступ запрещен' });

        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send({ error: 'Недействительный токен' });
        }
    } catch (err) {
        console.error(err);
    }
};