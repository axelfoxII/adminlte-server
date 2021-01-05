const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');



const getUsuarios = async (req, res) => {

  const desde =Number( req.query.desde) || 0;
  const [usuarios, total] = await Promise.all([
     Usuario.find({}, 'nombre email google role img')
                  .skip(desde)
                  .limit(5),
     Usuario.countDocuments()             
  ]);
  res.json({
    ok: true,
    usuarios,
    total
  });
 
};

const crearUsuarios = async(req, res = response) => {
 
  const {email, password} = req.body;

  try {
  const existeEmail = await Usuario.findOne({email});
  if (existeEmail) {
    return res.status(400).json({
      ok: false,
      msg: 'El correo ya existe'
    });
  }  
  const usuario = new Usuario(req.body);
  // Encriptar password
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  // Guardar usuario
  await usuario.save();
   // Generar el TOKEN - Jwt 
    token = await generarJWT(usuario.id); 
  res.json({
    ok: true,
    usuario,
    token
  });    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado....revisar logs'
    });    
  }
};

const actualizarUsuario = async(req, res = response) =>{

  // TODO: validar token y comprobar si es el usuario correcto
    
  const uid = req.params.id;  
  try {
  const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'El usuario no existe por ese id'
      });
    }
      // Actualizacion
     const {password, google, email, ...campos} = req.body;
    if (usuarioDB.email !== email) {
         const existeEmail = await Usuario.findOne({email});
        if (existeEmail) {
          return res.status(400).json({
            ok: false,
            msg:'El email ya existe'
          });
        }
    }
    if (!usuarioDB.google) {
      campos.email = email;      
    }else if(usuarioDB.email !== email){
      return res.status(400).json({
            ok: false,
            msg:'Usuarios de google no pueden cambiar su correo'
          });
    }
    //   corregir el error  (node:9436) DeprecationWarning: Mongoose: `findOneAndUpdate()` and `findOneAndDelete()`without the `useFindAndModify` option set to false are deprecated.
    // SOLUCION en el  findByIdAndUpdate---> useFindAndModify: false 
    
    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new : true,  useFindAndModify: false});

    res.json({
      ok: true,
      usuario: usuarioActualizado
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado'
    });
  }

}

const borrarUsuario = async(req, res = response) =>{
  const uid = req.params.id; 
    try {
      const usuarioDB = await Usuario.findById(uid);
          if (!usuarioDB) {
          return res.status(404).json({
          ok: false,
          msg: 'El usuario no existe'
        });
      } 
        await Usuario.findByIdAndDelete(uid);
        res.json({
          ok: true,
          msg: 'Usuario eliminado'
        });  
    } catch (error) {
      console.log(error);
       res.status(500).json({
       ok: false,
      msg: 'Error inesperado'
    });
    }
  }

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario
}