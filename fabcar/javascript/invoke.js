/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Submit the specified transaction.
        // createCar transaction - requires 6 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom', 500.0)
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('createCar', 'CAR20', 'Honda', 'Accord', 'Black', 'Tom', '500.0');
        console.log('Transaction createCar has been submitted');

        await contract.submitTransaction('changeCarPanne', 'CAR20', 'NouvellePanne');
        console.log('Transaction changeCarPanne has been submitted');

        await contract.submitTransaction('addCarReparation', 'CAR20', 'NouvelleReparation');
        console.log('Transaction addCarReparation has been submitted');

        await contract.submitTransaction('addCarCoutReparation', 'CAR20', '500.6');
        console.log('Transaction addCarCoutReparation has been submitted');

        await contract.submitTransaction('addCarCoutVente', 'CAR20', '200.0');
        console.log('Transaction addCarCoutVente has been submitted');

        await contract.submitTransaction('addCarDateDepart', 'CAR20', '2021-06-15');
        console.log('Transaction addCarDateDepart has been submitted');

        await contract.submitTransaction('addCarDateArrivee', 'CAR20', '2021-06-15');
        console.log('Transaction addCarDateArrivee has been submitted');

        await contract.submitTransaction('queryAllCoutVente');
        console.log('Transaction queryAllCoutVente has been submitted');

        await contract.submitTransaction('queryAllCoutReparation');
        console.log('Transaction queryAllCoutReparation has been submitted');

        await contract.submitTransaction('queryGetCA');
        console.log('Transaction queryGetCA has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
