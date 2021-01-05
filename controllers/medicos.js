const {response} = require('express');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuarios');


getMedicos = async (req, res= response) =>{
 const desde =Number( req.query.desde) ||  0;
  const [medicos, total] = await Promise.all([
     Medico.find({}, 'nombre img').populate('usuario','nombre')
                                                     .populate('hospital', 'nombre')
                  .skip(desde)
                  .limit(5),
     Medico.countDocuments()             
  ]);
  res.json({
    ok: true,
    medicos,
    total
  });
}
const getMedicoById = async (req, res= response) =>{
  const id = req.params.id;
  try {
        const medico = await Medico.findById(id)
                                                         .populate('usuario', 'nombre img')
                                                         .populate('hospital', 'nombre img')
                               
    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    console.log(error);
     res.json({
      ok: true,
      msg: 'Hable con el administrador'
    });
    
  }

}
crearMedico = async (req, res= response) => {

   const uid = req.uid; 
    const medico = new Medico({usuario: uid, ...req.body});
    console.log(medico);

    try {
      const medicoDB = await medico.save();
        res.json({
      ok: true,
      medico: medicoDB,
      

    });
      
    } catch (error) {
       console.log(error);
      res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
    }
}

actualizarMedico = async (req, res= response) =>{
  
  const id = req.params.id;
  const uid = req.uid;
  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: 'Medico no encontrado'
      });
    }
    // hospital.nombre = req.body.nombre;
    const cambiosMedico = {
        ...req.body,
        usuario: uid
    }
    const medicoActualizado = await  Medico.findByIdAndUpdate(id, cambiosMedico, {new: true,  useFindAndModify: false});

       res.json({
      ok: true,
      medico: medicoActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }  
}
borrarMedico = async(req, res= response) =>{
 
  const id = req.params.id;
 
  try {

    const medico = await Medico.findById(id);
    if (!medico) {
      res.status(404).json({
        ok: false,
        msg: 'Medico no encontrado'
      });
    }
    
    await  Medico.findByIdAndDelete(id);

       res.json({
      ok: true,
     msg: 'Medico Eliminado'
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}


module.exports = {
  getMedicos,
  getMedicoById,
  crearMedico,
  actualizarMedico,
  borrarMedico
}