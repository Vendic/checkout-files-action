import {expect, test} from '@jest/globals'
import * as core from '@actions/core'
import run from '../src/run'
import nock from 'nock'
import * as fs from "fs";

test('Should hit the Github REST API twice', async () => {
    const infoMock = jest.spyOn(core, 'info')

    const firstReply = fs.readFileSync(__dirname + '/github_first_response.json', 'utf-8')
    nock('https://api.github.com')
        .persist()
        .get('/repos/Vendic/github-actions-tests/contents/hello')
        .reply(200, JSON.parse(firstReply))

    const secondReply = fs.readFileSync(__dirname + '/github_second_response.json', 'utf-8')
    nock('https://api.github.com')
        .persist()
        .get('/repos/Vendic/github-actions-tests/contents/foo%2Fbar')
        .reply(200, JSON.parse(secondReply))

    await run()

    let paths : string[] = process.env['INPUT_PATHS']!.split('\n');

    paths.forEach(path => expect(infoMock).toHaveBeenCalledWith(`${path} saved to disk`))
    expect(infoMock).toHaveBeenCalledTimes(paths.length)
})

beforeEach(() => {
    process.env['INPUT_TOKEN'] = 'xyz'
    process.env['GITHUB_REPOSITORY'] = 'foo/bar';
    process.env['INPUT_REPO'] = 'Vendic/github-actions-tests'
    process.env['INPUT_PATHS'] = 'hello\nfoo/bar'
})
