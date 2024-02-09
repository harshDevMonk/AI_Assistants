require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { rootRouter } = require("./routes/assistant");
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', rootRouter)

app.use('*', (req, res) => {
    res.status(404).send("404 Page Not found")
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`App is up and running at ${port}`);
})
