export type GetContentResult = {
    status: number,
    url: string,
    data: {
        name: string
        path: string
        sha: string
        size: number
        url: string
        html_url: string
        git_url: string
        download_url: string
        type: string
        content: string
        encoding: string
    }
}

export type FileContentRequest = {
    owner: string,
    repo: string,
    path: string
    [key: string]: string
}
