const express = require("express");
const { Sequelize, sequelize, User } = require('./models');

const app = express()

app.use(express.text())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/users', async (req, res) => {
    const { firstName, email, lastName } = req.body
    try {
        const user = await User.create({ firstName, email, lastName })
        return res.json(user)
    } catch (e) {
        return res.status(500).json(e)
    }
})

//transaction
app.post('/transaction', async (req, res) => {
    const { firstName, email, lastName } = req.body
    const transaction = await sequelize.transaction();
    try {
        const user = await User.create({ firstName, email, lastName })
        await transaction.commit();
        console.log('Transaction committed successfully.');
        return res.json(user)
    } catch (error) {
        await transaction.rollback();
        console.log('error: ', error); 
    }
})

app.listen(8080, async () => {
    try {
        await sequelize.authenticate();
        console.log("sequelize connected")
    }
    catch (err) {
        console.log("error is", err)
    }
    console.log(`Server is running on port 8080`);
});