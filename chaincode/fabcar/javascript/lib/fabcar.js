/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const cars = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
                panne: 'test',
                reparation: 'test',
                coutlocation: 1.0,
                coutreparation: 500.0,
                dated: '',
                datea:'',
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, model, color, owner, coutl) {
        console.info('============= START : Create Car ===========');
        var coutlocation = parseFloat(coutl);
        const car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
            panne: '', 
            reparation: '',
            coutlocation,
            coutreparation: 0.0,
            dated: '',
            datea:'',
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllCars(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    async changeCarPanne(ctx, carNumber, newPanne) {
        console.info('============= START : changeCarPanne ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.panne = newPanne;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarPanne ===========');
    }

    async addCarReparation(ctx, carNumber, newReparation) {
        console.info('============= START : addCarReparation ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.reparation = newReparation;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : addCarReparation ===========');
    }

    async addCarCoutReparation(ctx, carNumber, newCoutReparation) {
        console.info('============= START : addCarCoutReparation ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.coutreparation = newCoutReparation;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : addCarCoutReparation ===========');
    }

    async addCarCoutLocation(ctx, carNumber, newCoutLocation) {
        console.info('============= START : addCarCoutLocation ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.coutlocation = newCoutLocation;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : addCarCoutLocation ===========');
    }

    async addCarDateDepart(ctx, carNumber, newdated) {
        console.info('============= START : addCarDateDepart ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.dated = newdated;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : addCarDateDepart ===========');
    }

    async addCarDateArrivee(ctx, carNumber, newdatea) {
        console.info('============= START : addCarDateArrivee ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.datea = newdatea;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : addCarDateArrivee ===========');
    }


}

module.exports = FabCar;
