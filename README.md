# Anaplan Integration Project

This project integrates with the Anaplan API to perform almost all the API calls available in:
- Authentication Service API
- Integration API v2

## What's Included
- In `src/repositories/*` you will find all the files that rawly interact with the Anaplan API.
  You should not use these files directly.
  *Most of the functions are not tested yet.*
- In `src/services/*` you will find all the files that interact with the repositories and provide a more user-friendly interface to interact with the Anaplan API.
  *This one is really in the beginning and will be improved in the future.*

## Example
Below is an example of how to use the AnaplanClient to connect to Anaplan and list all workspaces and models.
```javascript
// you should have a .env file in the root directory of the project
// with the following content:
// ANAPLAN_USERNAME=<your-username>
// ANAPLAN_PASSWORD=<your-password>
// ANAPLAN_INTEGRATION_API_URL=https://api.anaplan.com/2/0/
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
```

## Prerequisites

- Node.js
- npm

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/slavi010/anaplan-api-js-wrapper.git
    ```
2. Navigate to the project directory:
    ```sh
    cd anaplan-api-js-wrapper
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory of the project.
2. Copy the contents of `.env.example` to `.env`:
    ```sh
    cp .env.example .env
    ```
3. Fill in the required environment variables in the `.env` file:
    ```dotenv
    ANAPLAN_INTEGRATION_API_URL=<your-api-url>
    ANAPLAN_USERNAME=<your-username>
    ANAPLAN_PASSWORD=<your-password>
    ```

## Usage

To run the example script, execute the following command:
```sh
node src/useRepositories.js
```

## Contributing
Pull requests are strongly welcome.
For major changes, please open an issue first to discuss what you would like to change.

### Contributors
<a href="https://github.com/slavi010">
<img src="https://avatars.githubusercontent.com/u/49365528?v=4" alt="" size="64" height="64" width="64" data-view-component="true" class="avatar circle">
</a>

Sviatoslav BESNARD ([pro@slavi.dev](mailto:pro@slavi.dev))

## License
[GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/)