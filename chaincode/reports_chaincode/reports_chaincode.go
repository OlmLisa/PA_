package main
import (
"fmt"
"github.com/hyperledger/fabric/core/chaincode/shim"
pb "github.com/hyperledger/fabric/protos/peer"
)
var logger = shim.NewLogger( "ReportsChaincode" )
type ReportsChaincode struct {
}

func (cc *ReportsChaincode) Init(stub shim.ChaincodeStubInterface) 
pb.Response {
logger.SetLevel(shim.LogDebug)
logger.Info("ReportsChaincode.Init")
records := []Record{
{ID: "id1" , Name: "goods1" , Price: 100 , Date: SimpleDate{Day: 1 ,
Month: 1 , Year: 2018 }},
{ID: "id2" , Name: "goods2" , Price: - 90 , Date: SimpleDate{Day: 12 ,
Month: 2 , Year: 2019 }},
{ID: "id3" , Name: "goods3" , Price: 75 , Date: SimpleDate{Day: 27 ,
Month: 5 , Year: 2020 }},
}
for _ , record := range records {
if err := record.SaveState(stub); err != nil {
message := err.Error()
logger.Error(message)
return shim.Error(message)
}
}
return shim.Success( nil )
}

func (cc *ReportsChaincode) Invoke (stub shim.ChaincodeStubInterface)
pb.Response {
logger.Info("ReportsChaincode.Invoke")
function,args := stub.GetFunctionAndParameters()
logger.Debugf("function: %s" , function)
if function == "putRecord" {
return cc.putRecord(stub, args)
}
else if function == "getAnnualReport" {
return cc.getAnnualReport(stub, args)
}
else if function == "generateCustomReport" {
return cc.generateCustomReport(stub, args)
}
message := fmt.Sprintf( "unknown function name: %s, expected one of " +
"{putRecord, getAnnualReport, generateCustomReport}" , function)
logger.Error(message)
return pb.Response{Status: 400 , Message: message}
}

func (cc *ReportsChaincode) putRecord (stub shim.ChaincodeStubInterface, args
[] string ) pb.Response {

if len(args) != 4 {
message := fmt.Sprintf( "wrong number of arguments: passed %d, expected %d" , len(args), 4 )
logger.Error(message)
return pb.Response{Status: 400 , Message: message}
}
id , name := args[ 0 ], args[ 1 ]
price , err := strconv. ParseFloat(args[ 2 ], 64 )
if err != nil {
message := fmt.Sprintf( "unable to parse price: passed %s" , args[ 1 ])
logger.Error(message)
return pb.Response{Status: 400, Message: message}
}
date , err := parseDate(args[ 3 ])
if err != nil {
message := fmt.Sprintf( "unable to parse date: %s" , err. Error ())
logger.Error(message)
return pb.Response{Status: 400 , Message: message}
}
logger.Debugf( "id: %s, name: %s, price: %s, date: %s" , args[ 0 ], args[ 1 ], args[ 2 ], args[ 3 ])
record := Record{
ID: id,
Name: name,
Price: price,
Date: date,
}

logger.Info( "ReportsChaincode.putRecord" )
logger.Info( "ReportsChaincode.putRecord exited successfully" )
return shim.Success( nil )
}

func (cc *ReportsChaincode) getAnnualReport (stub shim.ChaincodeStubInterface,
args [] string ) pb.Response {
logger.Info( "ReportsChaincode.getAnnualReport" )

if len (args) != 1 {message := fmt.Sprintf( "wrong number of arguments: passed %d, expected %d" , len (args), 1 )
logger.Error (message)
return pb.Response{Status: 400 , Message: message}
}
year , err := strconv.Atoi (args[ 0 ])
if err != nil {
message := fmt.Sprintf("unable to parse year: passed %s" , args[ 0 ])
logger.Error(message)
return pb.Response{Status: 400 , Message: message}
}
logger.Debugf( "year: %d" , year)
queryString :=
fmt.Sprintf( `{"selector":{"date":{"year":%d}},"use_index":["_design/indexYearDoc", "indexYear"]}` , year)
logger.Debugf("query string: %s" , queryString)
return cc.getResultsForQueryString (stub, queryString)
}

func (cc *ReportsChaincode) generateCustomReport (stub
shim.ChaincodeStubInterface, args [] string ) pb.Response {
logger.Info("ReportsChaincode.generateCustomReport" )
if len(args) != 1 {
message := "no query string is specified"
logger.Error(message)
return pb.Response{Status: 400 , Message: message}
}
queryString := args[ 0 ]
logger.Debugf( "queryString: %s" , queryString)
return cc.getResultsForQueryString (stub, queryString)
}
func (cc *ReportsChaincode) getResultsForQueryString (stub
shim.ChaincodeStubInterface, queryString string ) pb.Response {
logger.Info("ReportsChaincode.getResultsForQueryString" )
it , err := stub.GetQueryResult (queryString)
if err != nil {
message := fmt.Sprintf("unable to perform a rich query using the query string %s: %s", queryString, err.Error ())
logger.Error(message)
return shim.Error(message)
}
defer it.Close()
var records = []Record{}
for it.HasNext() {
response,err := it.Next()
if err != nil {
message := fmt.Sprintf( "unable to get the next element: %s", err.Error())
logger.Error(message)
return shim.Error(message)
}
var record Record
if err := json.Unmarshal(response.Value, &record); err != nil {
message := fmt.Sprintf("unable to parse the response: %s" , err.Error())
logger.Error(message)
return shim.Error(message)
}
records = append (records, record)
}
result , err := json.Marshal(records)
if err != nil {
message := fmt.Sprintf("unable to marshal the result: %s" , err.Error())
logger.Error(message)
return shim.Error(message)
}
logger.Info( "ReportsChaincode.getResultsForQueryString exited successfully" )
return shim.Success(result)
}

func main () {
err := shim.Start( new(ReportsChaincode))
if err != nil {
fmt.Printf( "Error starting ReportsChaincode: %s" , err)
}
}



