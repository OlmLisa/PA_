'use strict';
const express = require('express');
const app = express();

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

// CORS Origin
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());

app.get('/cars', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        const result = await contract.evaluateTransaction('queryAllCars');
        res.json({status: true, cars: JSON.parse(result.toString())});
    } catch (err) {
        res.json({status: false, error: err});
    }
});

app.get('/allcoutvente', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        const result = await contract.evaluateTransaction('queryAllCoutVente');
        res.json({status: true, allcoutvente: JSON.parse(result.toString())});
    } catch (err) {
        res.json({status: false, error: err});
    }
});

app.get('/allcoutreparation', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        const result = await contract.evaluateTransaction('queryAllCoutReparation');
        res.json({status: true, allcoutreparation: JSON.parse(result.toString())});
    } catch (err) {
        res.json({status: false, error: err});
    }
});

app.get('/getca', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');

        const result = await contract.evaluateTransaction('queryGetCA');
        res.json({status: true, ca: JSON.parse(result.toString())});
    } catch (err) {
        res.json({status: false, error: err});
    }
});

app.get('/cars/:key', async (req, res) => {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        const result = await contract.evaluateTransaction('queryCar', req.params.key);
        res.json({status: true, car: JSON.parse(result.toString())});
    } catch (err) {
        res.json({status: false, error: err});
    }
});

app.post('/cars', async (req, res) => {
    console.log('prix:'+req.body.coutvente);
    if ((typeof req.body.key === 'undefined' || req.body.key === '') ||
      (typeof req.body.make === 'undefined' || req.body.make === '') ||
      (typeof req.body.model === 'undefined' || req.body.model === '') ||
      (typeof req.body.color === 'undefined' || req.body.color === '') ||
      (typeof req.body.coutvente === 'undefined' || req.body.coutvente === '') ||
      (typeof req.body.owner === 'undefined' || req.body.owner === '')) {
        res.json({status: false, error: {message: 'Missing body.'}});
        return;
    }
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');
        await contract.submitTransaction('createCar', req.body.key, req.body.make, req.body.model, req.body.color, req.body.owner, req.body.coutvente);
        res.json({status: true, message: 'Transaction (create car) has been submitted.'});
    } catch (err) {
        res.json({status: false, error: err});
    }
});


app.put('/cars/panne', async (req, res) => {
    if ((typeof req.body.key === 'undefined' || req.body.key === '') ||
        (typeof req.body.panne === 'undefined' || req.body.panne === '')) {
        res.json({status: false, error: {message: 'Missing body.'}});
        return;
    }

    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');

        await contract.submitTransaction('changeCarPanne', req.body.key, req.body.panne);
        await contract.submitTransaction('addCarDepartArrivee', req.body.key, req.body.arrivee);
        res.json({status: true, message: 'Transaction has been submitted.'});

    } catch (err) {
        res.json({status: false, error: err});
    }
});
app.put('/cars/reparation', async (req, res) => {
    if ((typeof req.body.key === 'undefined' || req.body.key === '') ||
        (typeof req.body.reparation === 'undefined' || req.body.reparation === '')) {
        res.json({status: false, error: {message: 'Missing body.'}});
        return;
    }

    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            res.json({status: false, error: {message: 'User not exist in the wallet'}});
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabcar');


        await contract.submitTransaction('addCarReparation', req.body.key, req.body.reparation);
        await contract.submitTransaction('addCarDepartArrivee', req.body.key, req.body.departarrivee);
        res.json({status: true, message: 'Transaction has been submitted.'});

    } catch (err) {
        res.json({status: false, error: err});
    }
});

app.listen(3000, () => {
    console.log('REST Server listening on port 3000');
});

