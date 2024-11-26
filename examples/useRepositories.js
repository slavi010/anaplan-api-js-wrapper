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

const m = require('../src/repositories');
require('dotenv').config({ path: '../.env'});

function main () {
    // prepare the authentication
    const auth = new m.anaplanAuth();
    auth.createAuthToken(process.env.ANAPLAN_USERNAME, process.env.ANAPLAN_PASSWORD)
        .then((token) => {
            // when the authentication is successful, you can use the token to interact with the API
            process.env.AUTH_TOKEN = token.token;
            console.log('Login message:', token.statusMessage);
            process.env.AUTH_TOKEN_FULL = token.tokenInfo;
            process.env.AUTH_TOKEN = token.tokenInfo.tokenValue;

            // list all the workspaces
            const workspaces = new m.workspaces(process.env.AUTH_TOKEN);
            workspaces.listWorkspaces()
                .then((workspaces) => {
                    console.log(workspaces);
                })
                .catch((error) => {
                    console.error(error);
                });

            // list all the models
            const models = new m.models(process.env.AUTH_TOKEN);
            models.listModels()
                .then((models) => {
                    console.log(models);
                })
                .catch((error) => {
                    console.error(error);
                });
        })
        .catch((error) => {
            console.error(error);
        });
}

main();