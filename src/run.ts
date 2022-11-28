import * as core from '@actions/core'
import * as github from '@actions/github'
import {GitHub} from "@actions/github/lib/utils";
import {OctokitResponse} from "@octokit/types";
import {GetContentResult, FileContentRequest} from "./types";
import * as fs from "fs";

export default async function run(): Promise<void> {
    try {
        const paths = core.getMultilineInput('paths')
        const repo = core.getInput('repo')
        const token = core.getInput('token')
        const ref = core.getInput('ref') ?? '';
        const octokit = github.getOctokit(token)

        for (let path of paths) {
            let response: GetContentResult = await getFileContent(octokit, repo, path, ref)
            if (response.status != 200) {
                throw new Error(`Received in response code ${response.status} from Github`)
            }

            saveContent(path, response.data.content)
        }
    } catch
        (error) {
        core.setFailed(`Action failed: ${error}`)
    }
}

async function getFileContent(
    octokit: InstanceType<typeof GitHub>,
    repository: string,
    path: string,
    ref: string
): Promise<OctokitResponse<any>> {
    const owner = repository.split('/')[0]
    const repo = repository.split('/')[1]
    let payload: FileContentRequest = {
        owner,
        repo,
        path,
    };
    if (ref !== '') {
        payload = {...payload, ref}
    }

    return octokit.rest.repos.getContent(payload);
}

function saveContent(path: string, encodedContent: string): void {
    const fileContent = Buffer.from(encodedContent, 'base64').toString('utf-8')
    if (path.includes('/')) {
        const foldersPath = path.split('/')
        foldersPath.pop()
        fs.mkdirSync(foldersPath.join('/'), {recursive: true});
    }

    fs.writeFileSync(path, fileContent, {encoding: 'utf-8'})
    core.info(`${path} saved to disk`)
}
