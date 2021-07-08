/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async queryCar(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
    }
    let carNumber = args[0];

    let carAsBytes = await stub.getState(carNumber); //get the car from chaincode state
    if (!carAsBytes || carAsBytes.toString().length <= 0) {
      throw new Error(carNumber + ' does not exist: ');
    }
    console.log(carAsBytes.toString());
    return carAsBytes;
  }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let cars = [];
    cars.push({
      make: 'Toyota',
      model: 'Prius',
      color: 'blue',
      owner: 'Tomoko',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Ford',
      model: 'Mustang',
      color: 'red',
      owner: 'Brad',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Hyundai',
      model: 'Tucson',
      color: 'green',
      owner: 'Jin Soo',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Volkswagen',
      model: 'Passat',
      color: 'yellow',
      owner: 'Max',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Tesla',
      model: 'S',
      color: 'black',
      owner: 'Adriana',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Peugeot',
      model: '205',
      color: 'purple',
      owner: 'Michel',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Chery',
      model: 'S22L',
      color: 'white',
      owner: 'Aarav',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Fiat',
      model: 'Punto',
      color: 'violet',
      owner: 'Pari',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Tata',
      model: 'Nano',
      color: 'indigo',
      owner: 'Valeria',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });
    cars.push({
      make: 'Holden',
      model: 'Barina',
      color: 'brown',
      owner: 'Shotaro',
      panne: 'Test',
      reparation: 'Reparation',
      coutlocation: 500.1,
      coutreparation: 0.0,
      dated: '',
      datea:''
    });

    for (let i = 0; i < cars.length; i++) {
      cars[i].docType = 'car';
      await stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
      console.info('Added <--> ', cars[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async createCar(stub, args) {
    console.info('============= START : Create Car ===========');
    if (args.length != 6) {
      throw new Error('Incorrect number of arguments. Expecting 6');
    }
    coutlocation = parseFloat(args[5]);
    var car = {
      docType: 'car',
      make: args[1],
      model: args[2],
      color: args[3],
      owner: args[4],
      panne: '',
      reparation: '',
      coutlocation: coutlocation,
      coutreparation: 0.0,
      dated: '',
      datea:''
    };

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }

  async queryAllCars(stub, args) {

    let startKey = 'CAR0';
    let endKey = 'CAR999';

    let iterator = await stub.getStateByRange(startKey, endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async changeCarOwner(stub, args) {
    console.info('============= START : changeCarOwner ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.owner = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : changeCarOwner ===========');
  }


  async changeCarPanne(stub, args) {
    console.info('============= START : changeCarPanne ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.panne = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END :changeCarPanne ===========');
  }

  async addCarReparation(stub, args) {
    console.info('============= START : addCarReparation ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.reparation = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END :addCarReparation ===========');
  }

  async addCarCoutReparation(stub, args) {
    console.info('============= START : addCarCoutReparation ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.coutreparation = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END :addCarCoutReparation ===========');
  }

  async addCarCoutLocation(stub, args) {
    console.info('============= START : addCarCoutLocation ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.coutlocation = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END :addCarCoutLocation ===========');
  }

  async addCarDateDepart(stub, args) {
    console.info('============= START : addCarDateDepart ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.dated = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END :addCarDateDepart ===========');
  }

  async addCarDateArrivee(stub, args) {
    console.info('============= START : addCarDateArrivee ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.datea = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END :addCarDateArrivee ===========');
  }
};

shim.start(new Chaincode());
