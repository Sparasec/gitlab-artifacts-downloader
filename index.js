#!/usr/bin/env node

const fs = require("fs");
const got = require("got");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);
const API_TOKEN = process.env.GITLAB_TOKEN
const gitUrl = process.env.GITLAB_URL

if (!API_TOKEN || !gitUrl) {
    console.log('set GITLAB_TOKEN and GITLAB_URL env variable')
    process.exit(1)
}
const directory = 'files'
const configFile = '.artifacts.json'

async function downloadJobs() {
    if (!fs.existsSync(configFile)) {
        console.log('artifacts config file not found', configFile)
        process.exit(2)
    }
    const versionData = JSON.parse(fs.readFileSync(configFile));
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
    }
    try {
        for (const module in versionData) {
            console.log("======================================");
            console.log("checking jobs for ", module);
            const moduleData = versionData[module];
            if (moduleData.paths) {
                for (const filename in moduleData.paths) {
                    const path = moduleData.paths[filename];
                    console.log(filename, path);
                    const url = `${gitUrl}/api/v4/projects/${moduleData.id}/jobs/artifacts/${moduleData.branch}/raw/${path}?job=${moduleData.job}`;
                    const job = got(url, {
                        isStream: true,
                        headers: {
                            "PRIVATE-TOKEN": API_TOKEN,
                        },
                    })
                    await pipeline(job, fs.createWriteStream(`${directory}/${filename}`))
                    console.log(`File downloaded to ${filename}`)
                }
            }
        }    
    } catch (error) {
        console.log('error', error)
        process.exit(3)
    }
    
}

downloadJobs();
