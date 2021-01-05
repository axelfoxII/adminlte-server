const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');

const validarJWT = (req, res, next) =>{

// Leer token
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición'
    });
  }
    try {
      
      const {uid} = jwt.verify(token, process.env.JWT_SECRET);
      req.uid = uid;
      
      next();

    } catch (error) {
      res.status(401).json({
        ok: false,
        msg: 'Token no valido'
      });
    }
}

const validarADMI_ROLE = async (req, res, next) =>{
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe..'
      });
    }

    if (usuarioDB !== 'ADMIN_ROLE') {
      return res.status(403).json({
        ok: false,
        msg: 'No esta autorizado..'
      });
    }

    next();
  
} catch (error) {
  console.log(error);
  res.status(500).json({
    ok: false,
    msg: 'Hable con el administrado'
  });
}
}

const validarADMI_ROLE_o_MismoUsuario = async (req, res, next) =>{
  const uid = req.uid;
  const id = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: 'Usuario no existe..'
      });
    }
    if (usuarioDB === 'ADMIN_ROLE' || uid === id) {
      next();
    }else{
        return res.status(403).json({
        ok: false,
        msg: 'No esta autorizado..'
      });
    }  
} catch (error) {
  console.log(error);
  res.status(500).json({
    ok: false,
    msg: 'Hable con el administrado'
  });
}
}


module.exports = {
  validarJWT,
  validarADMI_ROLE,
  validarADMI_ROLE_o_MismoUsuario
}