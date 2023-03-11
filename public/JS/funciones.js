const UrlBase = "http://localhost:3000/";

const fechaInicioReport = moment().format("YYYY-MM-DD 00:00:00")
const fechaFinReport = moment().format("YYYY-MM-DD 23:59:59")

/**
 * Listar usuarios
 * @returns
 */
const getUsers = async () => {
  let dataUsers = await fetch(UrlBase + "listarUsuarios");
  return JSON.parse(await dataUsers.text());
};


const getReportUsers = async (InicioReport = fechaInicioReport, FinReport = fechaFinReport ) => {

  const dataReport = {
    InicioReport,
    FinReport
  };



  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let data = JSON.stringify(dataReport);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: data,
  };

  let dataUsersHoras = await fetch(UrlBase + "getReportUsers", requestOptions);

  return JSON.parse(await dataUsersHoras.text());

};

const getReportAreas = async (InicioReport = fechaInicioReport, FinReport = fechaFinReport ) => {

  const dataReport = {
    InicioReport,
    FinReport
  };



  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let data = JSON.stringify(dataReport);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: data,
  };

  let dataAreasHoras = await fetch(UrlBase + "getReportAreas", requestOptions);
  return JSON.parse(await dataAreasHoras.text());


};


/**
 * Validar usuario por identifiacion
 * @param {*} usuIdentificacion
 * @returns
 */
const validateUser = async (usuIdentificacion) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let data = JSON.stringify(usuIdentificacion);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: data,
  };

  let userValidate = await fetch(UrlBase + "validateUser", requestOptions);

  return JSON.parse(await userValidate.text());
};

/**
 * Crear usuario
 * @param {*} dataUser
 * @returns
 */
const crearUsuario = async (dataUser) => {


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let data = JSON.stringify(dataUser);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: data,
  };

  let userInsert = await fetch(UrlBase + "addUser", requestOptions);
  userInsert = JSON.parse(await userInsert.text());

  return userInsert;
};

/**
 * Eliminar usuario
 * @param {*} idUser
 * @returns
 */
const deleteUser = async (idUser) => {


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let data = JSON.stringify(idUser);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: data,
  };

  let userDelete = await fetch(UrlBase + "deleteUser", requestOptions);

  return JSON.parse(await userDelete.text());
};

/**
 * Editar usuario
 * @param {*} usuId
 * @returns
 */
const editUser = async (usuId) => {


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let data = JSON.stringify(usuId);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: data,
  };

  let userEdit = await fetch(UrlBase + "editUser", requestOptions);

  return JSON.parse(await userEdit.text());
};

/**
 * Crear registro
 * @param {*} idUser 
 * @param {*} usufechaHora 
 * @param {*} salirEntrar 
 * @param {*} motivo 
 * @returns 
 */
const createRegistro = async (idUser, usufechaHora, salirEntrar, motivo = null) => {

    const dataRegistro = {
        idUser,
        usufechaHora,
        salirEntrar,
        motivo
    };



    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    let data = JSON.stringify(dataRegistro);
  
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
      body: data,
    };
  
    let inertRegistro = await fetch(UrlBase + "addRegistro", requestOptions);
  
    return JSON.parse(await inertRegistro.text());

};

/**
 * 
 * @returns 
 */
const getUsersDentro = async () => {
  let dataUsersDentro = await fetch(UrlBase + "listarUsuariosDentro");
  return JSON.parse(await dataUsersDentro.text());
};



