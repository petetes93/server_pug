require('dotenv').config()
require('express-async-errors')
const express = require('express')
const morgan = require('morgan')
const app = express()

const errors = require('./errors')

const { User } = require('./models/user')
const { Logro } = require('./models/logro')

app.use(morgan('dev'))

app.use(express.static('./src/assets'))

require('./db')()

app.set('views', './src/views')
app.set('view engine', 'pug')

const siteSetup = {
	isDarkMode: true,
	auth: true,
}

app.get('/users', async (req, res) => {
	const pageSetup = {
		...siteSetup,
		title: 'Lista de usuarios',
	}

	const users = await User.find()

	res.render('list', { ...pageSetup, users })
})

app.get('/users/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId).populate('logros')

	const pageSetup = {
		...siteSetup,
		title: `User "${user.username}"`,
		title: `Logro "${Logro.title}"`,
	}
	
	res.render('details', { ...pageSetup, user })
})

app.get(errors)

app.listen(3002, () => console.log('server on'))
