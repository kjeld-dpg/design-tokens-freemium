# Freemium Design Tokens

This repository is used to store and update design tokens for DPG Media's Freemium products. (ADR + HLN apps and websites).

## Workflow UX

The Figma Tokens plugin has some limitations regarding Bitbucket usage, therefor we will use both a GitHub repository as well as a repository on Bitbucket. It's important to stick to the following workflow to keep everything in sync between those repositories, make sure your system has all the correct [requirements](#sync-script-requirements).

1. [Create a new branch](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-and-deleting-branches-within-your-repository#creating-a-branch) on GitHub. Make sure to include the JIRA ticket number in your branch name (e.g., `feature/<ticket number>-<feature description>`).
2. Switch to the newly created branch in Figma Tokens.
3. Once you're done with your changes, make sure all your changes are pushed to GitHub. Open the Terminal application on your Mac and navigate to the Design Tokens Freemium project folder in the Terminal application. (If you don't have the project on your device yet, make sure to [clone it](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository#cloning-a-repository) first)
4. Run `yarn sync` from the Terminal application and provide the name of the branch you've used for your changes in Figma Tokens.
5. Once the script finished, [create a pull request](https://bitbucket.org/persgroep/design-tokens-freemium/pull-requests/new) on Bitbucket. 
> Pro tip: a url to create a new pull request might be provided in the script logs in the Terminal application. Holding the Command (<kbd>⌘</kbd>) key while double clicking the url will open this url.
6. After the pull request is merged to the main branch, the new changes in the main branch on Bitbucket will automatically be synced to the main branch on GitHub.

## Sync script requirements

To use the sync script you will have to configure a few things on your device and install some dependencies. If you run into issues or have questions about these steps, please contact someone from Metroid squad to help you out.

### SSH keys

Access to GitHub and Bitbucket is easiest to manage by using SSH keys. To do this make sure to [generate an SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key) first.

Once you've generated this key, add the public key to your [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-personal-ssh-keys-on-macos/#Provide-Bitbucket-Cloud-with-your-public-key) and [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account) account.
Also don't forget to [add the key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#adding-your-ssh-key-to-the-ssh-agent) to the ssh-agent.

### Dependencies

First of all make sure you have [Homebrew](https://brew.sh) installed on your Mac. This is a package manager which we will use to install the other dependencies.

After installation of Homebrew, run the following command to install the required dependencies:
```bash
brew update && brew install yarn && brew install node
```