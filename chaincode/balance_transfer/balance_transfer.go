package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/lib/cid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/pkg/errors"
)

var logger = shim.NewLogger("BalanceTransfer")

type BalanceTransfer struct {
}

func (cc *BalanceTransfer) Init(stub shim.ChaincodeStubInterface) pb.Response {
	logger.SetLevel(shim.LogDebug)
	logger.Info("BalanceTransfer.Init")
	return shim.Success(nil)
}

func (cc *BalanceTransfer) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	logger.Info("BalanceTransfer.Invoke")

	function, args := stub.GetFunctionAndParameters()
	logger.Debugf("function: %s", function)

	if function == "initAccount" {
		return cc.initAccount(stub, args)
	} else if function == "setBalance" {
		return cc.setBalance(stub, args)
	} else if function == "transfer" {
		return cc.transfer(stub, args)
	} else if function == "listAccounts" {
		return cc.listAccounts(stub, args)
	}

	message := fmt.Sprintf("unknown function name: %s, expected one of "+
		"{initAccount, setBalance, transfer, listAccounts}", function)
	logger.Error(message)
	return pb.Response{Status: 400, Message: message}
}

func (cc *BalanceTransfer) initAccount(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("BalanceTransfer.initAccount")

	if err := cid.AssertAttributeValue(stub, "init", "true"); err != nil {
		message := "you don't have permissions to initialize an account"
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	// check number of arguments
	if len(args) != 2 {
		message := fmt.Sprintf("wrong number of arguments: passed %d, expected %d", len(args), 2)
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	// check account balance format and value
	accountBalance, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		message := fmt.Sprintf("unable to parse account balance: passed %s", args[1])
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	if accountBalance < 0 {
		message := "account balance cannot be negative"
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	// parse the transaction creator
	txCreator, err := parseCommonName(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	account := Account{
		ID:      args[0],
		Owner:   txCreator,
		Balance: accountBalance,
	}

	// check if the account is already in the ledger
	isFound, err := account.LoadState(stub)
	if err != nil {
		message := fmt.Sprintf("unable to check account existence: %s", err.Error())
		logger.Error(message)
		return shim.Error(message)
	}

	if isFound {
		message := fmt.Sprintf("the specified account (%s) already exists", account.ID)
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	// try to save the account in the ledger
	if err := account.SaveState(stub); err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	logger.Info("BalanceTransfer.initAccount exited successfully")
	return shim.Success(nil)
}

func (cc *BalanceTransfer) setBalance(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("BalanceTransfer.setBalance")

	// check number of arguments
	if len(args) != 2 {
		message := fmt.Sprintf("wrong number of arguments: passed %d, expected %d", len(args), 2)
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	// parse the transaction creator
	txCreator, err := parseCommonName(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	account := Account{
		ID: args[0],
	}

	// try to load the account object with the given ID
	isFound, err := account.LoadState(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	if !isFound {
		message := fmt.Sprintf("unable to find the account %s", account.ID)
		logger.Error(message)
		return pb.Response{Status: 404, Message: message}
	}

	// check permissions to manage the account
	if account.Owner != txCreator {
		message := "unauthorized access: you can't change account that doesn't belong to you"
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	// check account balance format and value
	newBalance, err := strconv.ParseFloat(args[1], 64)
	if err != nil {
		message := fmt.Sprintf("unable to parse account balance: passed %s", args[1])
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	if newBalance < 0 {
		message := "balance cannot be negative"
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	// update the account in the ledger
	account.Balance = newBalance
	if err := account.SaveState(stub); err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	logger.Info("BalanceTransfer.setBalance exited successfully")
	return shim.Success(nil)
}

func (cc *BalanceTransfer) transfer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("BalanceTransfer.transfer")

	// check number of arguments
	if len(args) != 3 {
		message := fmt.Sprintf("wrong number of arguments: passed %d, expected %d", len(args), 3)
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	accountFrom := Account{
		ID: args[0],
	}

	accountTo := Account{
		ID: args[1],
	}

	// parse the transaction creator
	txCreator, err := parseCommonName(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	// try to load the accounts and check permissions to manage accountFrom
	isFound, err := accountFrom.LoadState(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	if !isFound {
		message := fmt.Sprintf("unable to find the account %s", accountFrom.ID)
		logger.Error(message)
		return pb.Response{Status: 404, Message: message}
	}

	if accountFrom.Owner != txCreator {
		message := "unauthorized access: you can't change account that doesn't belong to you"
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	isFound, err = accountTo.LoadState(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	if !isFound {
		message := fmt.Sprintf("unable to find the account %s", accountTo.ID)
		logger.Error(message)
		return pb.Response{Status: 404, Message: message}
	}

	// check amount to transfer format and value
	amountToTransfer, err := strconv.ParseFloat(args[2], 64)
	if err != nil {
		message := fmt.Sprintf("unable to parse account balance: passed %s", args[2])
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	if amountToTransfer <= 0 {
		message := "amount to transfer cannot be negative"
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	if accountFrom.Balance < amountToTransfer {
		message := "amount to transfer cannot be more than the current account balance"
		logger.Error(message)
		return pb.Response{Status: 400, Message: message}
	}

	// transfer the specified value
	accountFrom.Balance -= amountToTransfer
	accountTo.Balance += amountToTransfer

	// update both accounts
	if err := accountFrom.SaveState(stub); err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	if err := accountTo.SaveState(stub); err != nil {
		message := err.Error()
		logger.Error(message)
		return shim.Error(message)
	}

	logger.Info("BalanceTransfer.transfer exited successfully")
	return shim.Success(nil)
}

func (cc *BalanceTransfer) listAccounts(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	logger.Info("BalanceTransfer.listAccounts")

	// parse the transaction creator
	txCreator, err := parseCommonName(stub)
	if err != nil {
		message := err.Error()
		logger.Error(message)
		return pb.Response{Status: 403, Message: message}
	}

	it, err := stub.GetStateByPartialCompositeKey(accountObjType, []string{})
	if err != nil {
		message := "unable to get an iterator over the accounts"
		logger.Error(message)
		return shim.Error(message)
	}
	defer it.Close()

	var accounts []Account
	for it.HasNext() {
		response, err := it.Next()
		if err != nil {
			message := fmt.Sprintf("unable to get the next element: %s", err.Error())
			logger.Error(message)
			return shim.Error(message)
		}

		var account Account
		if err := json.Unmarshal(response.Value, &account); err != nil {
			message := fmt.Sprintf("unable to parse the response: %s", err.Error())
			logger.Error(message)
			return shim.Error(message)
		}

		if account.Owner == txCreator {
			accounts = append(accounts, account)
		}
	}

	result, err := json.Marshal(accounts)
	if err != nil {
		message := fmt.Sprintf("unable to marshal the result: %s", err.Error())
		logger.Error(message)
		return shim.Error(message)
	}

	logger.Info("BalanceTransfer,listAccounts exited successfully")
	return shim.Success(result)
}

func parseCommonName(stub shim.ChaincodeStubInterface) (string, error) {
	ownerCert, err := cid.GetX509Certificate(stub)
	if err != nil {
		message := "unable to parse account owner from the certificate"
		return "", errors.New(message)
	}

	accountOwner := ownerCert.Subject.CommonName
	if accountOwner == "" {
		message := "unable to parse account owner from the certificate"
		return "", errors.New(message)
	}

	return accountOwner, nil
}

func main() {
	err := shim.Start(new(BalanceTransfer))
	if err != nil {
		fmt.Printf("Error starting BalanceTransfer chaincode: %s", err)
	}
}
