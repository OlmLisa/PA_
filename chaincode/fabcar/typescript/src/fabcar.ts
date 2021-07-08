/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Car } from './car';

export class FabCar extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const cars: Car[] = [
            {
                color: 'blue',
                make: 'Toyota',
                model: 'Prius',
                owner: 'Tomoko',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'red',
                make: 'Ford',
                model: 'Mustang',
                owner: 'Brad',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''  
            },
            {
                color: 'green',
                make: 'Hyundai',
                model: 'Tucson',
                owner: 'Jin Soo',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'yellow',
                make: 'Volkswagen',
                model: 'Passat',
                owner: 'Max',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'black',
                make: 'Tesla',
                model: 'S',
                owner: 'Adriana',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'purple',
                make: 'Peugeot',
                model: '205',
                owner: 'Michel',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'white',
                make: 'Chery',
                model: 'S22L',
                owner: 'Aarav',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'violet',
                make: 'Fiat',
                model: 'Punto',
                owner: 'Pari',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'indigo',
                make: 'Tata',
                model: 'Nano',
                owner: 'Valeria',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
            {
                color: 'brown',
                make: 'Holden',
                model: 'Barina',
                owner: 'Shotaro',
                panne: 'Moteur',
                reparation: 'OK',
                coutlocation: 500.0,
                coutreparation: 2.0,
                dated: '',
                datea: ''
            },
        ];

        for (let i = 0; i < cars.length; i++) {
            cars[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
            console.info('Added <--> ', cars[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    public async queryCar(ctx: Context, carNumber: string): Promise<string> {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    public async createCar(ctx: Context, carNumber: string, make: string, model: string, color: string, owner: string, coutl:string) {
        console.info('============= START : Create Car ===========');
        var coutlocation = parseFloat(coutl);
        const car: Car = {
            color,
            docType: 'car',
            make,
            model,
            owner,
            panne: '',
            reparation: '',
            coutlocation,
            coutreparation : 0.0,
            dated: '',
            datea: ''
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    public async queryAllCars(ctx: Context): Promise<string> {
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

    public async changeCarOwner(ctx: Context, carNumber: string, newOwner: string) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car: Car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    public async changeCarPanne(ctx: Context, carNumber: string, newPanne: string) {
        console.info('============= START : changeCarPanne ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car: Car = JSON.parse(carAsBytes.toString());
        car.panne = newPanne;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarPanne ===========');
    }

    public async addCarReparation(ctx: Context, carNumber: string, newReparation: string) {
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

    public async addCarCoutReparation(ctx: Context, carNumber: string, newCoutReparation: number) {
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

    public async addCarCoutLocation(ctx: Context, carNumber: string, newCoutLocation: number) {
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

    public async addCarDateDepart(ctx: Context, carNumber: string, newdated: string) {
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

    public async addCarDateArrivee(ctx: Context, carNumber: string, newdatea: string) {
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
