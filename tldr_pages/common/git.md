# git

> Distributed version control system.
> More information: <https://git-scm.com/>.

- Initialize a new local repository:

`git init`

- Clone an existing repository:

`git clone {{https://github.com/user/repo.git}}`

- Show changed files which are not yet added for commit:

`git status`

- Add all current changes to the next commit:

`git add {{[-A|--all]}}`

- Add specific files to the next commit:

`git add {{path/to/file1 path/to/file2}}`

- Commit staged files to the repository with a message:

`git commit -m "{{commit message}}"`

- Show the commit history:

`git log`

- Push changes to a remote repository:

`git push {{origin}} {{branch}}`

- Pull changes from a remote repository:

`git pull {{origin}} {{branch}}`

- Create and switch to a new branch:

`git checkout -b {{new_branch}}`

- Switch to a different branch:

`git checkout {{branch_name}}`

- Show differences between working directory and last commit:

`git diff`