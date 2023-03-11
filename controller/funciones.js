const dbConn = require("../config/db.config");
const moment = require("moment");

/**
 * Peticiones SQL
 * @param {*} query
 * @param {*} params
 * @returns
 */
const mysqlRequest = (query, params = []) => {
  const queryStructure = {
    query,
    params,
  };
  return new Promise((resolve, reject) => {
    dbConn.query(
      queryStructure.query,
      queryStructure.params,
      (err, rows, fields) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

/**
 * Listar usuarios
 * @returns
 */
const listarUsuarios = async () => {
  const query = {
    query: `SELECT * FROM tbl_usuarios`,
  };
  try {
    const dataUsuarios = await mysqlRequest(query.query, query.params);

    return {
      ok: true,
      data: dataUsuarios,
      msg: "Usuario ya existe",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};


const getReportUsers = async (dataReport) => {

  const { InicioReport, FinReport} = dataReport;



  const query = {
    query: `
    SELECT 
    tblusu.nombre_usuario AS usuReNombre, 
    tblusu.tipo_usuario AS usuReTipo,
    tblusu.area_usuario AS usuReArea, 
    tblusu.cedula AS usuReCedula, 
    SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(fecha_salida, fecha_ingreso)))) AS usuReHoras
    FROM (
        SELECT r1.id_registro, r1.id_usuario_Fk, r1.fecha_hora_registro AS fecha_ingreso, MIN(r2.fecha_hora_registro) AS fecha_salida
        FROM tbl_registros r1
        LEFT JOIN tbl_registros r2 ON r1.id_usuario_Fk = r2.id_usuario_Fk 
          AND r1.fecha_hora_registro < r2.fecha_hora_registro 
          AND r1.tipo_registro = 0 AND r2.tipo_registro = 1
        WHERE r1.fecha_hora_registro BETWEEN ? AND ?
        GROUP BY r1.id_registro
    ) t
    INNER JOIN tbl_usuarios tblusu ON id_usuario_Fk=tblusu.id_usuario
    GROUP BY id_usuario_Fk;`,
    params: [InicioReport, FinReport]
  };
  try {
    const dataUsuariosHoras = await mysqlRequest(query.query, query.params);

    return {
      ok: true,
      data: dataUsuariosHoras,
      msg: "Consulta realizada",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};


const getReportAreas = async (dataReport) => {

  const { InicioReport, FinReport} = dataReport;


  const query = {
    query: `
    SELECT 
    u.area_usuario AS ReArea, 
    SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(r.fecha_salida, r.fecha_ingreso)))) AS ReHoras
    FROM (
        SELECT r1.id_registro, r1.id_usuario_Fk, r1.fecha_hora_registro AS fecha_ingreso, MIN(r2.fecha_hora_registro) AS fecha_salida
        FROM tbl_registros r1
        LEFT JOIN tbl_registros r2 ON r1.id_usuario_Fk = r2.id_usuario_Fk 
            AND r1.fecha_hora_registro < r2.fecha_hora_registro 
            AND r1.tipo_registro = 0 AND r2.tipo_registro = 1
        WHERE r1.fecha_hora_registro BETWEEN ? AND ?
        GROUP BY r1.id_registro
    ) r
    INNER JOIN tbl_usuarios u ON r.id_usuario_Fk = u.id_usuario
    GROUP BY u.area_usuario;`,
    params: [InicioReport, FinReport]
  };
  try {
    const dataAreaHoras = await mysqlRequest(query.query, query.params);

    return {
      ok: true,
      data: dataAreaHoras,
      msg: "Consulta realizada",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};


/**
 *
 * @param {*} data
 * @returns
 */
const validateUser = async (data) => {


  const { usuIdentificacion } = data;

  const query = {
    query: `SELECT * FROM tbl_usuarios WHERE cedula = ?`,
    params: [usuIdentificacion],
  };
  try {
    const usuario = await mysqlRequest(query.query, query.params);


    if (usuario.length > 0) {
      return {
        ok: true,
        idUser: usuario[0].id_usuario,
        msg: "Usuario ya existe",
      };
    } else {
      return {
        ok: false,
        msg: "Usuario no existe",
      };
    }
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};

/**
 * Agregar usuario
 * @param {*} data
 * @returns
 */
const addUser = async (data) => {


  const { usuNombre, usuIdentificacion, usuTipo, usuArea } = data;

  const fechaCreacion = moment().format("YYYY-MM-DD HH:mm:ss");



  const query = {
    query: `INSERT INTO tbl_usuarios (nombre_usuario,cedula,tipo_usuario,area_usuario,fecha_creacion) VALUES(?,?,?,?,?)`,
    params: [usuNombre, usuIdentificacion, usuTipo, usuArea, fechaCreacion],
  };
  try {
    const usuario = await mysqlRequest(query.query, query.params);



    return {
      ok: true,
      id_usr: usuario.insertId,
      msg: "usuario registrado con exito!",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};

/**
 * Eliminar usuario
 * @param {*} dataUser
 * @returns
 */
const deleteUser = async (dataUser) => {


  const { idUser } = dataUser;

  const query = {
    query: `DELETE FROM tbl_usuarios WHERE id_usuario = ?`,
    params: [idUser],
  };
  try {
    const dataDelete = await mysqlRequest(query.query, query.params);



    return {
      ok: true,
      msm: "Eliminado con exito",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};

/**
 * Editar usuario
 * @param {*} dataUser
 * @returns
 */
const editUser = async (dataUser) => {


  const { usuId, usuNombre, usuTipo, usuArea } = dataUser;
  const fechaEdicion = moment().format("YYYY-MM-DD HH:mm:ss");

  const query = {
    query: `Update tbl_usuarios Set nombre_usuario = ?,area_usuario = ?,tipo_usuario = ?,fecha_edicion = ? Where id_usuario = ?`,
    params: [usuNombre, usuArea, usuTipo,fechaEdicion, usuId],
  };
  try {
    const dataEdit = await mysqlRequest(query.query, query.params);

    return {
      ok: true,
      msm: "Editado con exito",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};

/**
 * Crear registro
 * @param {*} data 
 * @returns 
 */
const addRegistro = async (data) => {

  
    const { idUser, usufechaHora, salirEntrar, motivo } = data;
  
    const query = {
      query: `INSERT INTO tbl_registros (tipo_registro,fecha_hora_registro,excusa_salida,id_usuario_Fk) VALUES(?,?,?,?)`,
      params: [salirEntrar, usufechaHora, motivo, idUser],
    };
    try {
      const registro = await mysqlRequest(query.query, query.params);
  
      return {
        ok: true,
        id_usr: registro.insertId,
        msg: "registrado con exito",
      };
    } catch (error) {
      return {
        ok: false,
        msg: "Hubo un error en el servidor: " + error,
      };
    }
  };

/**
 * 
 * @returns Contar personas dentro de la empresa
 */
const listarUsuariosDentro = async () => {
  const query = {
    query: `
    SELECT COUNT(*) AS usuariosDentro
    FROM (
        SELECT 
        r1.id_usuario_Fk, r1.fecha_hora_registro AS fecha_ingreso, 
            MAX(r1.fecha_hora_registro) AS fecha_ultimo_registro,
            MAX(r1.tipo_registro) AS ultimo_tipo_registro
        FROM tbl_registros r1
        WHERE DATE(r1.fecha_hora_registro) = CURDATE()
        GROUP BY r1.id_usuario_Fk
    ) t
    WHERE t.ultimo_tipo_registro = 0 AND DATE(t.fecha_ultimo_registro) = CURDATE()`,
  };
  try {
    const dataUsuariosDentro = (await mysqlRequest(query.query, query.params))[0].usuariosDentro;

    return {
      ok: true,
      data: dataUsuariosDentro,
      msg: "Consulta realizada",
    };
  } catch (error) {
    return {
      ok: false,
      msg: "Hubo un error en el servidor: " + error,
    };
  }
};


module.exports = {
  addUser,
  validateUser,
  listarUsuarios,
  deleteUser,
  editUser,
  addRegistro,
  listarUsuariosDentro,
  getReportUsers,
  getReportAreas
};
