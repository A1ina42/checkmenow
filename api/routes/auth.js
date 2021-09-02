const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require("../validations/user");

//Регистрация 
router.post("/register", async (req, res) => {
	try {
		//* Валидация входных данных
		let mas = [];
		const { error } = registerValidation(req.body.user);
		console.log(error);
		if (error) {
			for (let i = 0; i < error.details.length; i++) {
				mas.push(error.details[i].message);
			}
			mas = [...new Set(mas)];
			console.log(error);
			return res.status(400).send({ errors: mas });
		}

		//* Проверка существования пользователя с таким эмейлом
		const emailExist = await User.findOne({ email: req.body.user.email });
		if (emailExist) {
			mas.push("Email уже занят");
		}

		//* Проверка существования пользователя с таким логин
		const nameExist = await User.findOne({ name: req.body.user.name });
		if (nameExist) {
			mas.push("Имя пользователя уже занято");
		}
		if (mas != null && mas.length >= 1)
			return res.status(400).send({ errors: mas });
		else {

			//* Шифрование пароля
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.user.password1, salt);

			//* Создание пользователя
			const user = new User({
				name: req.body.user.name,
				email: req.body.user.email,
				password: hashedPassword,
			});
			await user.save().then((user, err) => {
				if (err) return res.status(400).send({ err });

				//* Создание токена
				const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

				res.header('authorization', token).send({ user: { token, email: user.email, name: user.name } });
			});
		}
	}
	catch (err) {
		console.error(err);
	}
});

//* Авторизация
router.post('/login', async (req, res) => {
	try {
		//* Валидация входных данных
		const { error } = loginValidation(req.body.user);
		if (error) {
			let mas = [];
			for (let i = 0; i < error.details.length; i++) {
				mas.push(error.details[i].message);
			}
			mas = [...new Set(mas)];
			return res.status(400).send({ errors: mas });
		}

		const user = await User.findOne({ email: req.body.user.email });

		//* Проверка на гогин (вход через гугл))))
		if (!req.body.user.g) {
			//* Проверка на существование эмейла
			if (!user) return res.status(400).send({ errors: ["Email и/или пароль неверные"] });

			//* Валидация пароля
			const validPass = await bcrypt.compare(req.body.user.password, user.password);
			if (!validPass) return res.status(400).send({ errors: ["Email и/или пароль неверные"] });

			//* Создание токена
			const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
			res.header('authorization', token).send({ user: { token, email: user.email, name: user.name } });
		} else {
			if (!user) {
				//* Шифрование пароля
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(req.body.user.password, salt);
				const user = new User({
					name: req.body.user.name,
					email: req.body.user.email,
					password: hashedPassword,
				});
				await user.save().then((user, err) => {
					if (err) return res.status(400).send({ err });

					//* Создание токена
					const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
					res.header('authorization', token).send({ user: { token, email: user.email, name: user.name } });
				});
			}
			else {
				//* Валидация пароля
				const validPass = await bcrypt.compare(req.body.user.password, user.password);
				if (!validPass) return res.status(400).send({ errors: ["Email и/или пароль неверные"] });

				//* Создание токена
				const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
				res.header('authorization', token).send({ user: { token, email: user.email, name: user.name } });
			}
		}
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
