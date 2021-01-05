const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-front');

const login = async(req, res = response) =>{
   const {email, password} = req.body;
  try {
    // Verificar emaill
    const usuarioDB = await Usuario.findOne({email});
      if (!usuarioDB) {
          return res.status(404).json({
          ok: false,
          msg: '-->Email o contraseña no valida'
        });
      }
      
     // Verificar Contraseña 
       const validPassword = bcrypt.compareSync(password, usuarioDB.password);
      if (!validPassword) {
        return res.status(400).json({
             ok: false,
            msg: 'Email o -->contraseña no valida'
        });
      }
    // Generar el TOKEN - Jwt 
    const token = await generarJWT(usuarioDB.id); 
       res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.role)
    });
    
  } catch (error) {
     console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado....revisar logs'
    });    
  }
}

const googleSignIn = async(req, res = response) =>{
 
  const googleToken = req.body.token;

  try {
    const {name, email, picture} = await googleVerify(googleToken);
    const usuarioDB = await Usuario.findOne({email});
    let usuario;
    if (!usuarioDB) {
      // Si no existe el usuario
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true
      });
    }else{
      // Existe el usuario
      usuario = usuarioDB;
      usuario.google = true;
      usuario.password ='@@@';
    }

    // Guardar en Base de Datos
      await usuario.save();

     // Generar el TOKEN - Jwt 
    const token = await generarJWT(usuario.id); 

      res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuario.role)
    });
    
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Token no es correcto',
      
    });
  }
}

const renewToken = async (req, res = response) =>{

    const uid = req.uid;

    // Generar el TOKEN - Jwt 
    const token = await generarJWT(uid); 
    // Obtener uusuario por UID
    const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario,
    menu: getMenuFrontEnd(usuario.role)
  });
}

module.exports ={
  login,
  googleSignIn,
  renewToken
}