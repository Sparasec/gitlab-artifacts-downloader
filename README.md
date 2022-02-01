### artifacts downloader

downloads latest artifacts from multiple projects and CI/CD jobs

#### env variables
- GITLAB_TOKEN: gitlab token
- GITLAB_URL: gitlab http api address, eg: https://git.company.com

#### sample config (.artifacts.json)
```
{
    "my-project":  {
        "id": 128,
        "job": "build",
        "branch": "master",
        "paths": {
            "build46.exe": "install/amd64/build.exe",
            "build32.exe": "install/i386/build.exe"
        }
    }
}
```