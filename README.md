# VGRepo1 Sheet

This project is a free website you can publish with GitHub Pages. Your friends can open the link, enter their first name, last name, and a comment, and the form will send those responses into a Google Sheet.

## What is included

- A bright, simple website with the heading `VGRepo1 sheet`
- A version badge in the corner
- Automatic version updates on every GitHub Pages deployment
- A ready-to-paste Google Apps Script backend that writes submissions to Google Sheets

## Files you will use

- `index.html`: the webpage
- `styles.css`: the bright design
- `script.js`: form submission and version loading
- `config.js`: where you paste your Google Apps Script web app URL
- `google-apps-script/Code.gs`: the script to attach to your Google Sheet
- `.github/workflows/deploy.yml`: automatic GitHub Pages deployment and version generation

## Step 1: Create the Google Sheet backend

1. Create a new Google Sheet.
2. In the Google Sheet, click `Extensions` -> `Apps Script`.
3. Replace the default code with the contents of `google-apps-script/Code.gs`.
4. Save the project.
5. Click `Deploy` -> `New deployment`.
6. Choose type `Web app`.
7. Set:
   - Execute as: `Me`
   - Who has access: `Anyone`
8. Deploy it and copy the web app URL.

## Step 2: Add your Google Apps Script URL

Open `config.js` and replace:

```js
PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
```

with your deployed Apps Script URL.

## Step 3: Push this project to GitHub

1. Create a GitHub repository.
2. Push these files to the `main` branch.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `GitHub Actions`.
5. Push again if needed.

After the GitHub Action finishes, your site will be available at:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/
```

## Step 4: Share the link

Send the GitHub Pages link to your friends. When they submit the form, the data will be added to the `Responses` sheet inside your Google Sheet.

## How versioning works

Every time you push a change to the `main` branch and the GitHub Pages workflow runs, `version.json` is regenerated automatically.

Example version format:

```text
2026.03.29.4
```

That means:

- `2026.03.29` is the UTC build date
- `4` is the GitHub Actions run number for that workflow

The badge also shows the short commit hash.

## Local preview

You can open `index.html` in a browser for a quick preview, but the version badge works best once the site is served through GitHub Pages or another local web server.

nik working
