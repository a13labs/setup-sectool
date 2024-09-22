const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const os = require('os');
const path = require('path');
const fs = require('fs');
const https = require('https');

// Determine the platform and architecture
const platform = os.platform();
const arch = os.arch();

// URL base for the binary releases
const binaryBaseURL = 'https://github.com/a13labs/sectool/releases/download/';

async function downloadBinary(version) {
    const fileName = `sectool-${version}-${platform}-${arch}`;
    const url = `${binaryBaseURL}${version}/${fileName}`;
    const outputPath = path.join(process.env['RUNNER_TEMP'], fileName);

    core.info(`Downloading ${fileName} from ${url}`);

    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(outputPath);
        https.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(() => resolve(outputPath));
            });
        }).on('error', function (err) {
            fs.unlink(outputPath);
            reject(err);
        });
    });
}

async function run() {
    try {
        const version = core.getInput('version');
        const binaryPath = await downloadBinary(version);

        // Make the binary executable
        await exec.exec('chmod', ['+x', binaryPath]);

        // Add the binary to the PATH
        core.addPath(path.dirname(binaryPath));

        core.info('My Go tool is installed and added to the PATH');
    } catch (error) {
        core.setFailed(`Action failed with error ${error}`);
    }
}

run();
