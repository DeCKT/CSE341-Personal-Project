const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllData = async (req, res, next) => {
    const result = await mongodb.getDb().db().collection('contacts').find();
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
        next();
    });
};

const getById = async (req, res, next) => {
    try {
        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDb().db().collection('contacts').find({ _id: userId });
        result.toArray().then((lists) => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(lists[0]);
            next();
        });
    } catch (err) {
        res.status(404).json(err);
    }
};

const addContact = async (req, res, next) => {
    try {
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };
        if (!req.body.firstName) {
            res.status(400).json('First Name is required');
            throw err;
        }
        const result = await mongodb.getDb().db().collection('contacts').insertOne(contact);
        if (result.acknowledged) {
            res.status(201).json(result);
            next();
        } else {
            res.status(500).json();
            throw err;
        }
    } catch (err) {
        res.status(404).json(err);
    }
};

const updateContact = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb
        .getDb()
        .db()
        .collection('contacts')
        .updateOne(
            { _id: contactId },
            {
                $set: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    favoriteColor: req.body.favoriteColor,
                    birthday: req.body.birthday
                }
            }
        );
    if (result.acknowledged) {
        res.status(200).json(result);
        next();
    } else {
        res.status(500).json(
            result.error || 'Some error occured while attempting to update contact'
        );
    }
};

const deleteContact = async (req, res, next) => {
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('contacts').deleteOne({ _id: contactId });
    if (result.acknowledged) {
        res.status(200).json(result);
        next();
    } else {
        res.status(500).json(
            result.error || 'Some error occured while attempting to delete contact'
        );
    }
};

module.exports = { getAllData, getById, addContact, updateContact, deleteContact };
