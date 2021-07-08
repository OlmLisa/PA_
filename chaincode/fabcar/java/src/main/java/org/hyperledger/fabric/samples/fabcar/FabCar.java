/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.fabcar;

import java.util.ArrayList;
import java.util.List;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

import com.owlike.genson.Genson;

/**
 * Java implementation of the Fabric Car Contract described in the Writing Your
 * First Application tutorial
 */
@Contract(
        name = "FabCar",
        info = @Info(
                title = "FabCar contract",
                description = "The hyperlegendary car contract",
                version = "0.0.1-SNAPSHOT",
                license = @License(
                        name = "Apache 2.0 License",
                        url = "http://www.apache.org/licenses/LICENSE-2.0.html"),
                contact = @Contact(
                        email = "f.carr@example.com",
                        name = "F Carr",
                        url = "https://hyperledger.example.com")))
@Default
public final class FabCar implements ContractInterface {

    private final Genson genson = new Genson();

    private enum FabCarErrors {
        CAR_NOT_FOUND,
        CAR_ALREADY_EXISTS
    }

    /**
     * Retrieves a car with the specified key from the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @return the Car found on the ledger if there was one
     */
    @Transaction()
    public Car queryCar(final Context ctx, final String key) {
        ChaincodeStub stub = ctx.getStub();
        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        return car;
    }

    /**
     * Creates some initial Cars on the ledger.
     *
     * @param ctx the transaction context
     */
    @Transaction()
    public void initLedger(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();

        String[] carData = {
                "{ \"make\": \"Toyota\", \"model\": \"Prius\", \"color\": \"blue\", \"owner\": \"Tomoko\", \"panne\": \"Moteur\", \"reparation\":  \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5 }, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Ford\", \"model\": \"Mustang\", \"color\": \"red\", \"owner\": \"Brad\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Hyundai\", \"model\": \"Tucson\", \"color\": \"green\", \"owner\": \"Jin Soo\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Volkswagen\", \"model\": \"Passat\", \"color\": \"yellow\", \"owner\": \"Max\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Tesla\", \"model\": \"S\", \"color\": \"black\", \"owner\": \"Adrian\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Peugeot\", \"model\": \"205\", \"color\": \"purple\", \"owner\": \"Michel\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Chery\", \"model\": \"S22L\", \"color\": \"white\", \"owner\": \"Aarav\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Fiat\", \"model\": \"Punto\", \"color\": \"violet\", \"owner\": \"Pari\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Tata\", \"model\": \"nano\", \"color\": \"indigo\", \"owner\": \"Valeria\", \"panne\": \"Moteur\ ", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}",
                "{ \"make\": \"Holden\", \"model\": \"Barina\", \"color\": \"brown\", \"owner\": \"Shotaro\", \"panne\": \"Moteur\", \"reparation\": \"Test\", \"coutlocation\": 28.5,\"coutreparation\": 1.5, \"dated\": \"14-06-2021\", \"datea\": \"18-06-2021\"}"
        };

        for (int i = 0; i < carData.length; i++) {
            String key = String.format("CAR%03d", i);

            Car car = genson.deserialize(carData[i], Car.class);
            String carState = genson.serialize(car);
            stub.putStringState(key, carState);
        }
    }

    /**
     * Creates a new car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key for the new car
     * @param make the make of the new car
     * @param model the model of the new car
     * @param color the color of the new car
     * @param owner the owner of the new car
     * @param coutlocation the location cost of the new car
     * @return the created Car
     */
    @Transaction()
    public Car createCar(final Context ctx, final String key, final String make, final String model,
            final String color, final String owner, final String coutlocation) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);
        if (!carState.isEmpty()) {
            String errorMessage = String.format("Car %s already exists", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_ALREADY_EXISTS.toString());
        }
        float coutl = Float.parseFloat(coutlocation);
        Car car = new Car(make, model, color, owner, "", "", coutl, 0.0, "","");
        carState = genson.serialize(car);
        stub.putStringState(key, carState);

        return car;
    }

    /**
     * Retrieves every car between CAR0 and CAR999 from the ledger.
     *
     * @param ctx the transaction context
     * @return array of Cars found on the ledger
     */
    @Transaction()
    public Car[] queryAllCars(final Context ctx) {
        ChaincodeStub stub = ctx.getStub();

        final String startKey = "CAR0";
        final String endKey = "CAR999";
        List<Car> cars = new ArrayList<Car>();

        QueryResultsIterator<KeyValue> results = stub.getStateByRange(startKey, endKey);

        for (KeyValue result: results) {
            Car car = genson.deserialize(result.getStringValue(), Car.class);
            cars.add(car);
        }

        Car[] response = cars.toArray(new Car[cars.size()]);

        return response;
    }

    /**
     * Changes the owner of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newOwner the new owner
     * @return the updated Car
     */
    @Transaction()
    public Car changeCarOwner(final Context ctx, final String key, final String newOwner) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), newOwner, car.getPanne(), cat.getReparation(), car.getCoutLocation(), car.getCoutReparation(), car.getDated(), car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }

        /**
     * Changes the panne of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newPanne the new owner
     * @return the updated Car
     */
    @Transaction()
    public Car changeCarPanne(final Context ctx, final String key, final String newPanne) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), car.getOwner(), newPanne, cat.getReparation(), car.getCoutLocation(), car.getCoutReparation(), car.getDated(), car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }

    /**
     * Changes the reparation of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newReparation the new newReparation
     * @return the updated Car
     */
    @Transaction()
    public Car addCarReparation(final Context ctx, final String key, final String newReparation) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), getOwner(), car.getPanne(), newReparation, car.getCoutLocation(), car.getCoutReparation(), car.getDated(), car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }

    /**
     * Changes the location cost of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newCostLocation the new newReparation
     * @return the updated Car
     */
    @Transaction()
    public Car addCarCoutLocation (final Context ctx, final String key, final Float newCostLocation) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), getOwner(), car.getPanne(), car.getReparation(), newCostLocation, car.getCoutReparation(), car.getDated(), car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }

    /**
     * Changes the reparation cost of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newCostReparation the new newReparation
     * @return the updated Car
     */
    @Transaction()
    public Car addCarCoutReparation (final Context ctx, final String key, final Float newCostReparation) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), getOwner(), car.getPanne(), car.getReparation(), getCoutLocation(), newCostReparation, car.getDated(), car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }

    /**
     * Changes the depart date of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newDateDepart the new newReparation
     * @return the updated Car
     */
    @Transaction()
    public Car addCarDateDepart (final Context ctx, final String key, final String newDateDepart) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), getOwner(), car.getPanne(), car.getReparation(), getCoutLocation(), getCoutReparation(), newDateDepart, car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }

    /**
     * Changes the depart date of a car on the ledger.
     *
     * @param ctx the transaction context
     * @param key the key
     * @param newDateDepart the new newReparation
     * @return the updated Car
     */
    @Transaction()
    public Car addCarDateArrivee (final Context ctx, final String key, final String newDateDepart) {
        ChaincodeStub stub = ctx.getStub();

        String carState = stub.getStringState(key);

        if (carState.isEmpty()) {
            String errorMessage = String.format("Car %s does not exist", key);
            System.out.println(errorMessage);
            throw new ChaincodeException(errorMessage, FabCarErrors.CAR_NOT_FOUND.toString());
        }

        Car car = genson.deserialize(carState, Car.class);

        Car newCar = new Car(car.getMake(), car.getModel(), car.getColor(), getOwner(), car.getPanne(), car.getReparation(), getCoutLocation(), getCoutReparation(), newDateDepart, car.getDatea());
        String newCarState = genson.serialize(newCar);
        stub.putStringState(key, newCarState);

        return newCar;
    }
}
