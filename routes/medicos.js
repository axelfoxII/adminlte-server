/*
 Ruta: /api/medicos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const { validarJWT } = require('../helpers/validar-jwt');
const { getMedicos, 
           getMedicoById,
           crearMedico, 
           actualizarMedico, 
           borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get('/', validarJWT, getMedicos);

router.post('/',validarJWT,[
check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
check('hospital', 'El hospital id debe ser valido').isMongoId(),
validarCampos
],crearMedico);

router.put('/:id', validarJWT,
[
check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
check('usuario', 'El usuario id debe ser valido').isMongoId(),
check('hospital', 'El hospital id debe ser valido').isMongoId(),
],actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);

router.get('/:id', validarJWT, getMedicoById);


module.exports = router;