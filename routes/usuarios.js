/*
 Ruta: /api/usuarios
*/
const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMI_ROLE, validarADMI_ROLE_o_MismoUsuario } = require('../helpers/validar-jwt');

const router = Router();

router.get('/', validarJWT ,getUsuarios);
router.post('/',
[
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('password', 'El password es obligatorio').not().isEmpty(),
check('email','El email es obligatorio').isEmail(),
validarCampos,
],crearUsuarios);

router.put('/:id',[validarJWT, validarADMI_ROLE_o_MismoUsuario],
[
check('nombre', 'El nombre es obligatorio').not().isEmpty(),
check('email','El email es obligatorio').isEmail(),
check('role','El rol es obligatorio').not().isEmpty(),
validarCampos,
],actualizarUsuario);

router.delete('/:id',[validarJWT, validarADMI_ROLE], borrarUsuario);



module.exports = router;