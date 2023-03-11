const path = require('path');
const http = require('http');
const express = require('express');

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const server = http.createServer(app);
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));





const {
    addUser,
    validateUser,
    listarUsuarios,
    deleteUser,
    editUser,
    addRegistro,
    listarUsuariosDentro,
    getReportUsers,
    getReportAreas

} = require('./controller/funciones.js')

/**
 * Listar usuarios
 */
app.get("/listarUsuarios", async (req, res) => {
    
    let DataUsers = await listarUsuarios();
    res.json(DataUsers);
});



app.post("/getReportUsers", async (req, res) => {

    let DataUsersHoras = await getReportUsers(req.body);
    res.json(DataUsersHoras);

});



app.post("/getReportAreas", async (req, res) => {
    
    let DataAreasHoras = await getReportAreas(req.body);
    res.json(DataAreasHoras);

});


/**
 * Validar usuario
 */
app.post("/validateUser", async (req, res) => {
    
    let DataUser = await validateUser(req.body);



    res.json(DataUser);

});

/**
 * Crear usuario
 */
app.post("/addUser", async (req, res) => {
    
    let DataUser = await addUser(req.body);



    res.json(DataUser);

});

/**
 * Eliminar usuario
 */
app.post("/deleteUser", async (req, res) => {
    
    let DataUser = await deleteUser(req.body);



    res.json(DataUser);

});

/**
 * Editar usuario
 */
app.post("/editUser", async (req, res) => {
    
    let DataUser = await editUser(req.body);


    res.json(DataUser);

});

/**
 * Crear registro
 */
app.post("/addRegistro", async (req, res) => {
    
    let dataRegistro = await addRegistro(req.body);



    res.json(dataRegistro);

});

/**
 * Listar usuarios dentro
 */
app.get("/listarUsuariosDentro", async (req, res) => {
    
    let DataUsersDentro = await listarUsuariosDentro();
    res.json(DataUsersDentro);

});