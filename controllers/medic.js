const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const Medic = require('../models/medic');
const generateJWT = require('../helpers/jwt');

const getMedics = async (req = request, res = response) => {

    const to = Number(req.query.to) || 0;

    const limit = Number(req.query.limit) || 5;

    const [medics, total] = await Promise.all([
        Medic.find()
            .populate('user', 'name img')
            .populate('hospital', 'name img')
            .skip(to)
            .limit(limit),
        Medic.countDocuments()
    ]);

    res.status(200).json({
        ok: true,
        medics,
        total
    });

}

const getMedicById = async (req = request, res = response) => {

    try {

        const medic = await Medic.findById(req.params.id)
            .populate('user', 'name img')
            .populate('hospital', 'name img').catch(err => console.log(err))

        res.status(200).json({
            ok: true,
            medic
        });

    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'Contac from Administrator'
        });
    }



}

const createMedic = async (req = request, res = response) => {

    try {

        const medic = new Medic({ ...req.body, user: req.uid });

        await medic.save();

        res.status(200).json({
            ok: true,
            medic
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });

    }

}

const updateMedic = async (req = request, res = response) => {

    try {

        const exist = await Medic.findById(req.params.id);

        if (!exist) {

            return res.status(400).json({
                ok: false,
                msg: 'Medic no exist'
            });

        }

        const campos = req.body;

        const medic = await Medic.findByIdAndUpdate(req.params.id, campos, { new: true });

        res.status(200).json({
            ok: true,
            medic
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });

    }

}

const deleteMedic = async (req = request, res = response) => {

    try {

        const medic = await Medic.findById(req.params.id);

        if (!medic) {

            return res.status(400).json({
                ok: false,
                msg: 'Medic no exist'
            });

        }

        await medic.delete();

        res.status(200).json({
            ok: true
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });

    }

}

module.exports = {
    getMedics,
    getMedicById,
    createMedic,
    updateMedic,
    deleteMedic
}