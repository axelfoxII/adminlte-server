const {response} = require('express');
const Hospital = require('../models/hospital');

getHospitales = async (req, res= response) =>{
  const desde =Number( req.query.desde) || 0;
  const [hospitales, total] = await Promise.all([
     Hospital.find({}, 'nombre img').populate('usuario','nombre')
                  .skip(desde)
                  .limit(5),
     Hospital.countDocuments()             
  ]);
  res.json({
    ok: true,
    hospitales,
    total
  });
}

crearHospital = async(req, res= response) =>{
  
  const uid = req.uid; 
  const hospital = new Hospital({usuario: uid, ...req.body});
  
  try {

    const hospitalDB = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalDB
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }  
}

actualizarHospital = async(req, res= response) =>{
  
  const id = req.params.id;
  const uid = req.uid;
  try {

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      res.status(404).json({
        ok: false,
        msg: 'Hospital no encontrado'
      });
    }
    // hospital.nombre = req.body.nombre;
    const cambiosHospital = {
        ...req.body,
        usuario: uid
    }
    const hospitalActualizado = await  Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true,  useFindAndModify: false});

       res.json({
      ok: true,
      hospital: hospitalActualizado
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
  
}
borrarHospital = async(req, res= response) =>{
 
  const id = req.params.id;
 
  try {

    const hospital = await Hospital.findById(id);
    if (!hospital) {
      res.status(404).json({
        ok: false,
        msg: 'Hospital no encontrado'
      });
    }
    
    await  Hospital.findByIdAndDelete(id);

       res.json({
      ok: true,
     msg: 'Hospital Eliminado'
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
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital
}