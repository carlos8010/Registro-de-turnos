const tableUsers = $("#tableUsers");

/**
 * Agregar hora en la parte crear registro
 */
setInterval( () => {
  const fechaHoraActual = moment().format("YYYY-MM-DD HH:mm:ss");
  $("#regfecha_hora").val(fechaHoraActual);
}, 1000);



/**
 * llenar por defecto campos de reporte
 */
$(async function () {

  const fechaInicioReport = moment().format("YYYY-MM-DD 00:00:01")
  const fechaFinReport = moment().format("YYYY-MM-DD 23:59:59")

  $("#reFechaInicio").val(fechaInicioReport);
  $("#reFechaFin").val(fechaFinReport);

});

/**
 * Listar tabla
 */
$(async function () {
  

  let dataUsuarios = await getUsers();

  let usuarios = dataUsuarios.data;

  usuarios = usuarios.map(
    ({
      area_usuario,
      cedula,
      fecha_creacion,
      id_usuario,
      nombre_usuario,
      tipo_usuario,
      ...rest
    }) => {
      return {
        usuArea: area_usuario,
        usuCedula: cedula,
        usuFecha: fecha_creacion,
        usuId: id_usuario,
        usuNombre: nombre_usuario,
        usuTipo: tipo_usuario,
        ...rest,
      };
    }
  );

  tableUsers.bootstrapTable({ data: usuarios });
});


/**
 * Listar reporte de horas trabajadas por usuario
 */
$(async function () { 
  
  const tableUsersHoras = $("#tableUsersHoras");

  const quitarDecimal = (objeto) => {
    if (objeto.usuReHoras === null) return objeto;

    const nuevoObjeto = Object.assign({}, objeto);
    nuevoObjeto.usuReHoras = nuevoObjeto.usuReHoras.toString().slice(0, 8);
    return nuevoObjeto;
  }

  let dataUsuarios = await getReportUsers();

  let usuariosHoras = dataUsuarios.data;

  usuariosHoras = usuariosHoras.map(quitarDecimal);

  tableUsersHoras.bootstrapTable({ data: usuariosHoras });

});

/**
 * Listar reporte de horas trabajadas por area
 */
$(async function () { 
  
  const tableAreaHoras = $("#tableAreaHoras");

  const quitarDecimal = (objeto) => {
    if (objeto.ReHoras === null) return objeto;
    
    const nuevoObjeto = Object.assign({}, objeto);
    nuevoObjeto.ReHoras = nuevoObjeto.ReHoras.toString().slice(0, 8);
    return nuevoObjeto;
  };

  let dataArea = await getReportAreas();


  let areasHora = dataArea.data;

  areasHora = areasHora.map(quitarDecimal);
  


  tableAreaHoras.bootstrapTable({ data: areasHora });

});


/**
 * Agregar iconos a la tabla
 * @param {*} value 
 * @param {*} row 
 * @param {*} index 
 * @returns 
 */
function operateFormatter(value, row, index) {
  return [
    '<a class="Editar" href="javascript:void(0)" title="Editar" id="edit">',
    '<i class="bi bi-pencil-fill"></i>',
    '</a>  ',
    '</a>&nbsp;&nbsp;',
    '</a>&nbsp;&nbsp;',
    '</a>&nbsp;&nbsp;',
    '</a>&nbsp;&nbsp;',
    '</a>&nbsp;&nbsp;',
    '<a class="Eliminar" href="javascript:void(0)" title="Eliminar" id="delete">',
    '<i class="bi bi-trash"></i>',
    '</a>'
  ].join('')
}


/**
 * funciones de la tabla (CREAR - EDITAR)
 */
window.operateEvents = {
  'click #edit': function (e, value, row, index) {


    const {usuId, usuCedula, } = row;

    $("#ModalEditeUser").modal("show");

    $("#usuEditNombre").val(row.usuNombre)
    $("#usuEditIdentificacion").val(row.usuCedula)
    $("#usuEditTipo").val(row.usuTipo)
    $("#usuEditArea").val(row.usuArea)


    $("#editar_usuario_btn").click(() => {

      $("#formulario_edit_usuario").parsley().validate();
      if ($("#formulario_edit_usuario").parsley().isValid()) {
  
  
        
        Swal.fire({
          title: "¿Desea editar el usuario?",
          text: "No se puede revertir esta acción",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#008000",
          confirmButtonText: "Editar",
        }).then(async (result) => {
    
          if (result.isConfirmed) {

            let usuNombre = $("#usuEditNombre").val();
            let usuTipo = $("#usuEditTipo").val();
            let usuArea = $("#usuEditArea").val();

            const datosActualizados = {
              usuId,
              usuCedula,
              usuNombre,
              usuTipo,
              usuArea
            }
    
            
            editUser({usuId,usuNombre,usuTipo,usuArea}).then(async (responseEdit) =>  {
    
    
              if (responseEdit.ok) {
    
                Swal.fire("Usuario editado con exito!", "", "success");

                $("#ModalEditeUser input:not([type='button'])").val("");

                let indice = tableUsers.bootstrapTable('getData').findIndex(function(row){
                  return row.usuId == usuId;
                });
                tableUsers.bootstrapTable('updateRow', {index: indice, row: datosActualizados});
                
                $("#formulario_edit_usuario").parsley().reset();
                $("#ModalEditeUser").modal("hide");
                
                
              }else{
    
                Swal.fire("Error al editar usuario!", "Comunicate con el encargado", "error");
                $("#formulario_edit_usuario").parsley().reset();
    
              }
    
            })
            
    
            
            
      
    
          }
    
          
        });
        
  
      }

    });







  },
  'click #delete': function (e, value, row, index) {

    const idUser = row.usuId;

    Swal.fire({
      title: "¿Desea eliminar el usuario?",
      text: "No se puede revertir esta acción",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#8B0000",
      confirmButtonText: "Eliminar",
    }).then(async (result) => {

      if (result.isConfirmed) {


        deleteUser({idUser}).then(async (responseDelete) =>  {


          if (responseDelete.ok) {

            Swal.fire("Usuario eliminado con exito!", "", "success");
            
          }else{

            Swal.fire("Error al eliminar usuario!", "Comunicate con el encargado", "error");

          }

        })


        tableUsers.bootstrapTable('remove', {
          field: 'usuId',
          values: [idUser]
        })
  

      }

      
    });

    
  }
}

/**
 * Crear usuario
 */
$("#crear_usuario_btn").click(() => {
  $("#formulario_usuario").parsley().validate();
  if ($("#formulario_usuario").parsley().isValid()) {
    let usuNombre = $("#usuNombre").val();
    let usuIdentificacion = $("#usuIdentificacion").val();
    let usuTipo = $("#usuTipo").val();
    let usuArea = $("#usuArea").val();


    Swal.fire({
      title: "Desea crear el registro?",
      text: "",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      confirmButtonText: "Crear",
    }).then(async (result) => {
      if (result.isConfirmed) {
        validateUser({ usuIdentificacion }).then(async (dataValidateUser) => {
          if (!dataValidateUser.ok) {
            let userCreate = await crearUsuario({
              usuNombre,
              usuIdentificacion,
              usuTipo,
              usuArea,
            });



            if (userCreate.ok) {
              Swal.fire("Usuario creado con exito!", "", "success").then(
                async (result) => {
                  if (result.isConfirmed) {

                    location.reload();

                  }
                }
              );
            } else {
              Swal.fire(
                "Error al crear usuario!",
                "Comunicate con el encargado",
                "error"
              );

              $("#usuNombre").val("");
              $("#usuIdentificacion").val("");
              $("#formulario_usuario").parsley().reset();
            }
          } else {
            Swal.fire("Este usuario ya se encuentra registrado!", "", "error");

            $("#usuIdentificacion").val("");
            $("#formulario_usuario").parsley().reset();
          }
        });
      }
    });
  }
});

/**
 * Registrar salida o ingreso
 */
$("#Registrar_btn").click(() => {
  $("#registroIngesoSalida").parsley().validate();
  if ($("#registroIngesoSalida").parsley().isValid()) {

    const usuIdentificacion = $("#regIdentificacion").val();
    const usufechaHora = $("#regfecha_hora").val();
    const usuingreso = $("#regingreso:checked").val();
    const ususalida = $("#regsalida:checked").val();

    /**
     * Ingreso = 0;  Salida = 1;
     */
    const salirEntrar = usuingreso || ususalida;



    validateUser({ usuIdentificacion }).then(async (dataValidateUser) => {
  
      if (dataValidateUser.ok) {

        const { idUser } = dataValidateUser

        let horaValidar = moment(usufechaHora).format("HH:mm")
        horaValidar = moment(horaValidar, "HH:mm");

        const horaReferencia = moment("16:00", "HH:mm");

        if (horaValidar.isBefore(horaReferencia) && salirEntrar == 1) {



          
          const { value: motivo } = await Swal.fire({
            title: 'Selecciona un motivo de retiro',
            input: 'select',
            inputOptions: {
              'Cita medica': 'Cita medica',
              'Calamidad': 'Calamidad',
              'Diligencia personal': 'Diligencia personal'
            },
            inputPlaceholder: 'Seleccione un motivo',
            showCancelButton: true,
            inputValidator: (value) => {

              return new Promise((resolve) => {
                if (value) {
                  resolve()
                } else {
                  resolve('Necesitas seleccionar un motivo')
                }
              })
            }
          })
          
          if (motivo) {

            
            let regitroCreate = await createRegistro(
              idUser,
              usufechaHora,
              salirEntrar,
              motivo
            );



            if (regitroCreate.ok) {
              Swal.fire("Registro exitoso!", "", "success").then(
                async (result) => {
                  if (result.isConfirmed) {

                    $("#registroIngesoSalida").parsley().reset();
                    $("#registroIngesoSalida input:not([type='button']):not([type='radio'])").val("");
                    $('#regingreso').prop('checked', true);
                    $('#regsalida').prop('checked', false);

                  }
                }
              );
            } else {

              Swal.fire(
                "Error al crear registro!",
                "Comunicate con el encargado",
                "error"
              );

            }
            
  
            
          }
          


        } else {



          
          let regitroCreate = await createRegistro(
            idUser,
            usufechaHora,
            salirEntrar
          );



          if (regitroCreate.ok) {
            Swal.fire("Registro exitoso!", "", "success").then(
              async (result) => {
                if (result.isConfirmed) {

                  $("#registroIngesoSalida").parsley().reset();
                  $("#registroIngesoSalida input:not([type='button']):not([type='radio'])").val("");
                  $('#regingreso').prop('checked', true);
                  $('#regsalida').prop('checked', false);

                }
              }
            );
          } else {

            Swal.fire(
              "Error al crear registro!",
              "Comunicate con el encargado",
              "error"
            );
            
          }
          

        }



        /*
        
        */


      } else {

        Swal.fire("Este usuario no se encuentra registrado!", "", "error");

        $("#usuIdentificacion").val("");
        $("#registroIngesoSalida").parsley().reset();

      }
      
    });


  }
  
});

/**
 * Contar personas dentro de la empresa
 */
$("#Reportes-tab").click(async() => {
  
  const h5Element = $("#usuariosDentro");

  let dataUsuariosDentro = await getUsersDentro();



  if (dataUsuariosDentro.ok) {

    const usariosDentro = dataUsuariosDentro.data;

    h5Element.text("Usuarios en la empresa hoy:  " + usariosDentro);
    
  }

})



/**
 * Generar reportes
 */
$("#generarReporte").click(async () => {

  const reFechaInicio = moment($("#reFechaInicio").val()).format("YYYY-MM-DD HH:mm:ss");
  const reFechaFin = moment($("#reFechaFin").val()).format("YYYY-MM-DD HH:mm:ss") ;



  

  /**
   * Listar reporte de horas trabajadas por usuario
   */

    
    const tableUsersHoras = $("#tableUsersHoras");

    tableUsersHoras.bootstrapTable('removeAll');

    const quitarDecimalUser = (objeto) => {
      if (objeto.usuReHoras === null) return objeto;

      const nuevoObjeto = Object.assign({}, objeto);
      nuevoObjeto.usuReHoras = nuevoObjeto.usuReHoras.toString().slice(0, 8);
      return nuevoObjeto;
    }

    let dataUsuarios = await getReportUsers(reFechaInicio, reFechaFin);



    let usuariosHoras = dataUsuarios.data;

    usuariosHoras = usuariosHoras.map(quitarDecimalUser);
    


    //tableUsersHoras.bootstrapTable({ data: usuariosHoras });
    tableUsersHoras.bootstrapTable('load', usuariosHoras);


  /**
   * Listar reporte de horas trabajadas por area
   */
    
    const tableAreaHoras = $("#tableAreaHoras");

    tableAreaHoras.bootstrapTable('removeAll');

    const quitarDecimalArea = (objeto) => {
      if (objeto.ReHoras === null) return objeto;
      
      const nuevoObjeto = Object.assign({}, objeto);
      nuevoObjeto.ReHoras = nuevoObjeto.ReHoras.toString().slice(0, 8);
      return nuevoObjeto;
    };

    let dataArea = await getReportAreas(reFechaInicio, reFechaFin);



    let areasHora = dataArea.data;

    areasHora = areasHora.map(quitarDecimalArea);
    


    //tableAreaHoras.bootstrapTable({ data: areasHora });
    tableAreaHoras.bootstrapTable('load', areasHora);



})

