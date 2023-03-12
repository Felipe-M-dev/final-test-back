const express = require("express")
const jwt = require("jsonwebtoken")

const { secretKey } = require("./secretKey")
const cors = require("cors")
const app = express()

const { port } = require("./src/config/config")

const { registrarUsuario, verificarCredenciales, obtenerDatosDeUsuario, actualizaUsuario, registrarServer, obtenerServers, actualizaServer, eliminarServer } = require("./src/controllers/server.controller")
const { checkCredentialsExists, tokenVerification } = require("./src/middleware/middlewares")

app.listen(port, console.log(`SERVER START ON PORT ${port}`))
app.use(cors())
app.use(express.json())

app.post("/users", checkCredentialsExists, async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.status(201).send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, secretKey)
        const user = await obtenerDatosDeUsuario(email)
        res.send({ token, user })
    } catch ({ code, message }) {
        res.status(code).send(message)
    }

})

app.put("/users/:id", tokenVerification, checkCredentialsExists, async (req, res) => {
    try {
        const { id } = req.params
        const usuario = req.body
        await actualizaUsuario(usuario, id)
        res.status(201).send("Datos de Usuario actualizados con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.post("/servers", tokenVerification, async (req, res) => {
    try {
        const server = req.body
        await registrarServer(server)
        res.status(201).send("Server creado con éxito")
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.get("/servers", tokenVerification, async (req, res) => {
    try {
        const server = req.body
        const servers = await obtenerServers(server)
        res.status(200).send(servers)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

app.put("/servers/:id", tokenVerification , async (req, res) => {
    try {
        const { id } = req.params
        const server = req.body
        await actualizaServer(server, id)
        res.status(201).send("Datos de Server actualizados con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete("/servers/:id", tokenVerification , async (req, res) => {
    try {
        const { id } = req.params
        await eliminarServer(id)
        res.status(201).send("Server eliminado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})