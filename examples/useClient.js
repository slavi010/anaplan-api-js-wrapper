/**
 * @project anaplan-api-js-wrapper
 * @author Sviatoslav BESNARD (pro@slavi.dev)
 * @createdAt 11/2024
 * @license GNU AGPLv3
 *
 * You should have a .env file in the root directory of the project
 * with the following content:
 * ANAPLAN_USERNAME=<your-username>
 * ANAPLAN_PASSWORD=<your-password>
 * ANAPLAN_INTEGRATION_API_URL=https://api.anaplan.com/2/0/
 */

require('dotenv').config({ path: '../.env'});
const AnaplanClient = require('../src/Client');

async function main () {
    const client = new AnaplanClient();

    // Connect to Anaplan with username and password
    await client.connect({
        username: process.env.ANAPLAN_USERNAME,
        password: process.env.ANAPLAN_PASSWORD
    });

    // Verify connection, throw an error if not connected
    await client.verifyConnection();
    console.log('Connected to Anaplan');

    // List all workspaces
    const workspaces = await client.getAllWorkspaces();
    console.log(workspaces[0]);

    // List all models of the first workspace
    const models = await workspaces[0].getAllModels();
    console.log(models[0]);
}

main();