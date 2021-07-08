/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the car structure, with 4 properties.  Structure tags are used by encoding/json library
type Car struct {
	Make           string    `json:"make"`
	Model          string    `json:"model"`
	Colour         string    `json:"color"`
	Owner          string    `json:"owner"`
	Panne          string    `json:"panne"`
	Reparation     string    `json:"reparation"`
	CoutVente      float64   `json:"coutvente"`
	CoutReparation float64   `json:"coutreparation"`
	DateDepart     time.Time `json:"dated"`
	DateArrivee    time.Time `json:"datea"`
	DepartArrivee  int       `json:"departarrivee"`
}

type DataStructure struct {
	Key    string `json:"Key"`
	Record struct {
		Make           string    `json:"make"`
		Model          string    `json:"model"`
		Colour         string    `json:"color"`
		Owner          string    `json:"owner"`
		Panne          string    `json:"panne"`
		Reparation     string    `json:"reparation"`
		CoutVente      float64   `json:"coutvente"`
		CoutReparation float64   `json:"coutreparation"`
		DateDepart     time.Time `json:"dated"`
		DateArrivee    time.Time `json:"datea"`
	} `json:"Record"`
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryCar" {
		return s.queryCar(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createCar" {
		return s.createCar(APIstub, args)
	} else if function == "queryAllCars" {
		return s.queryAllCars(APIstub)
	} else if function == "changeCarOwner" {
		return s.changeCarOwner(APIstub, args)
	} else if function == "addCarCoutVente" {
		return s.addCarCoutVente(APIstub, args)
	} else if function == "addCarCoutReparation" {
		return s.addCarCoutReparation(APIstub, args)
	} else if function == "addCarDateArrivee" {
		return s.addCarDateArrivee(APIstub, args)
	} else if function == "addCarDateDepart" {
		return s.addCarDateDepart(APIstub, args)
	} else if function == "addCarDepartArrivee" {
		return s.addCarDepartArrivee(APIstub, args)
	} else if function == "changeCarPanne" {
		return s.changeCarPanne(APIstub, args)
	} else if function == "addCarReparation" {
		return s.addCarReparation(APIstub, args)
	} else if function == "queryAllCoutVente" {
		return s.queryAllCoutVente(APIstub)
	} else if function == "queryAllCoutReparation" {
		return s.queryAllCoutReparation(APIstub)
	} else if function == "queryGetCA" {
		return s.queryGetCA(APIstub)
	}

	return shim.Error("Invalid Smart Contract function nameee.")
}

func (s *SmartContract) queryCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(carAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	const (
		layoutISO = "2006-01-02"
	)
	date := "2021-06-16"
	datedep, _ := time.Parse(layoutISO, date)

	date2 := "2021-07-16"
	datearr, _ := time.Parse(layoutISO, date2)

	//datedep, err := time.Parse("2006-01-02", "2021-06-16")
	//if err != nil {
	//return shim.Error("dated parse time failed")
	//}

	//datearr, err := time.Parse("2006-01-02", "2021-07-16")
	//if err != nil {
	//return shim.Error("datea parse time failed")
	//}

	cars := []Car{
		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro", Panne: "Moteur", Reparation: "Test", CoutVente: 9000.5, CoutReparation: 5000.0, DateDepart: datedep, DateArrivee: datearr},
	}

	i := 0
	for i < len(cars) {
		fmt.Println("i is ", i)
		carAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
		fmt.Println("Added", cars[i])
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createCar(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}

	coutvente, err := strconv.ParseFloat(args[5], 64)
	if err != nil {
		return shim.Error("Erreur dans createCar parsefloat64.")
	}
	var car = Car{Make: args[1], Model: args[2], Colour: args[3], Owner: args[4], CoutVente: coutvente}

	carAsBytes, _ := json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func FloatToString(input_num float64) string {
	// to convert a float number to a string
	return strconv.FormatFloat(input_num, 'f', 6, 64)
}

func (s *SmartContract) queryAllCars(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		//var price = 0.0;
		//price = queryResponse.Value(c);
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
func Date(year, month, day int) time.Time {
	return time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)
}

func (s *SmartContract) queryAllCoutVente(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	var buffercost bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")

		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAll:\n%s\n", buffer.String())

	var datastruct []DataStructure
	var data string = buffer.String()
	if err := json.Unmarshal([]byte(data), &datastruct); err != nil {
		panic(err)
	}
	var total = 0.0

	for _, item := range datastruct {
		total += item.Record.CoutVente
	}

	coutventestring := FloatToString(total)
	buffercost.WriteString(coutventestring)

	return shim.Success(buffercost.Bytes())
}

func (s *SmartContract) queryAllCoutReparation(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	var buffercost bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		//var price = 0.0;
		//price = queryResponse.Value(c);
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCoutReparation:\n%s\n", buffer.String())

	var datastruct []DataStructure
	var data string = buffer.String()
	if err := json.Unmarshal([]byte(data), &datastruct); err != nil {
		panic(err)
	}
	var total = 0.0
	for _, item := range datastruct {
		total += item.Record.CoutReparation
	}

	coutreparationstring := FloatToString(total)
	buffercost.WriteString(coutreparationstring)

	return shim.Success(buffercost.Bytes())
}

func (s *SmartContract) queryGetCA(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "CAR0"
	endKey := "CAR999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	var buffercost bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		//var price = 0.0;
		//price = queryResponse.Value(c);
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryGetCA:\n%s\n", buffer.String())

	var datastruct []DataStructure
	var data string = buffer.String()
	if err := json.Unmarshal([]byte(data), &datastruct); err != nil {
		panic(err)
	}
	var totalCoutR = 0.0
	var totalCoutL = 0.0
	for _, item := range datastruct {
		totalCoutR += item.Record.CoutReparation
		totalCoutL += item.Record.CoutVente
	}
	var CA = 0.0
	CA = totalCoutL - totalCoutR
	coutreparationstring := FloatToString(CA)
	buffercost.WriteString(coutreparationstring)

	return shim.Success(buffercost.Bytes())
}

func (s *SmartContract) changeCarOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.Owner = args[1]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) addCarDepartArrivee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	da, _ := strconv.Atoi(args[1])
	car.DepartArrivee = da

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) changeCarPanne(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.Panne = args[1]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) addCarReparation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)
	car.Reparation = args[1]

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) addCarCoutReparation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)

	coutr, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error("cout reparation parse float failed")
	}

	car.CoutReparation = coutr

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) addCarCoutVente(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)

	coutl, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		return shim.Error("cout vente parse float failed")
	}

	car.CoutVente = coutl

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) addCarDateDepart(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)

	dated, err := time.Parse("2006-01-02", args[1])
	if err != nil {
		return shim.Error("dated parse time failed")
	}
	// cardatedepart := dated.Format("2006-01-02") ===> to string

	car.DateDepart = dated

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) addCarDateArrivee(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	car := Car{}

	json.Unmarshal(carAsBytes, &car)

	datea, err := time.Parse("2006-01-02", args[1])
	if err != nil {
		return shim.Error("datea parse time failed")
	}

	car.DateArrivee = datea

	carAsBytes, _ = json.Marshal(car)
	APIstub.PutState(args[0], carAsBytes)

	return shim.Success(nil)
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
