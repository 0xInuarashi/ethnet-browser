///// Import Node Modules /////
import express                  from "express";
import cors                     from "cors";
import compression              from "compression";

///// Import Local Modules /////
import {
    browser_getData
} from "./modules/browser.js";

const SERVER = new express();
const PORT = 3000;

SERVER.use(cors());
SERVER.use(compression());

const regex_handleAtobJsonB64 = /^data:(.+?);base64,/;
const _hasAtobJsonB64 = (string_) => regex_handleAtobJsonB64.test(string_);
const _trimAtobJsonB64 = (string_) => string_.replace(regex_handleAtobJsonB64, '');

const _convertAtobJsonB64ToData = (string_) => {
    const match = string_.match(regex_handleAtobJsonB64);
    if (match) {
        const contentType = match[1];
        const encodedData = _trimAtobJsonB64(string_);
        const decodedData = Buffer.from(encodedData, 'base64').toString();
        return { contentType, data: decodedData };
    } else {
        return { contentType: "unknown", data: string_}; // Invalid data string format
    };
};

SERVER.get('/:id_', async(req, res, next) => {
    try {
        const _id = req.params.id_ || null;
        const _identifier = req.query.identifier || null;
        const _creator = req.query.creator || null;

        if (_id === null &&
            _identifier === null &&
            _creator === null) {

            res.status(400).json({"message": "no query"});
            return
        };

        const _dataQuery = await browser_getData(_id, _identifier, _creator);
        const _dataPackage = [];
    
        for (let _data of _dataQuery) {
            console.log(_data);
            console.log(_data.args);
            _dataPackage.push(_data.args[3]);
        };
    
        res.status(200).json(_dataPackage);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({"message": "error"});
    };
});

SERVER.get('/', async(req, res, next) => {
    try {
        const _id = req.query.id || null;
        const _identifier = req.query.identifier || null;
        const _creator = req.query.creator || null;

        if (_id === null &&
            _identifier === null &&
            _creator === null) {

            res.status(400).json({"message": "no query"});
            return
        };

        const _dataQuery = await browser_getData(_id, _identifier, _creator);
        const _dataPackage = [];
    
        for (let _data of _dataQuery) {
            console.log(_data);
            console.log(_data.args);
            _dataPackage.push(_data.args);
        };
    
        res.status(200).json(_dataPackage);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({"message": "error"});
    };
});

SERVER.get('/parsed', async(req, res, next) => {
    try {
        const _id = req.query.id || null;
        const _identifier = req.query.identifier || null;
        const _creator = req.query.creator || null;

        if (_id === null &&
            _identifier === null &&
            _creator === null) {

            res.status(400).json({"message": "no query"});
            return
        };

        const _dataQuery = await browser_getData(_id, _identifier, _creator);
        const _dataPackage = [];
    
        for (let _data of _dataQuery) {
            console.log(_data.args[3]);
            _dataPackage.push(_convertAtobJsonB64ToData(_data.args[3]));
        };
    
        res.status(200).json(_dataPackage);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({"message": "error"});
    };
});

SERVER.get("*", (req, res, next) => {
    res.status(200).json("Hello World!");
});

SERVER.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});