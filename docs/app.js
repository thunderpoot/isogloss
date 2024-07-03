let languages;

async function fetchLanguages() {
    try {
        const response = await fetch('consolidated_langs.json');
        languages = await response.json();
        console.log('Languages data loaded:', languages);
        updateDatalist();

        const { lookupType, language } = getURLParams();
        if (lookupType) {
            document.getElementById('lookupToggle').value = lookupType;
        }
        if (language) {
            document.getElementById('lookupInput').value = language;
            lookupLanguage();
        }
    } catch (error) {
        console.error('Error fetching languages:', error);
    }
}

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const lookupType = params.get('type');
    const language = params.get('lang');
    return { lookupType, language };
}

function toggleLookup() {
    document.getElementById('lookupInput').value = '';
    document.getElementById('result').textContent = '';
    updateDatalist();
}

function updateDatalist() {
    const lookupType = document.getElementById('lookupToggle').value;
    const select = document.getElementById('lookupInput');
    select.innerHTML = '<option value="" disabled selected>Select a language</option>';

    if (lookupType === 'name') {
        const names = new Set();
        for (const details of Object.values(languages.iso3)) {
            if (details["Name(s)"]) {
                names.add(details["Name(s)"]);
            }
            if (details["Native name(s)"]) {
                names.add(details["Native name(s)"]);
            }
            if (details["Other name(s)"]) {
                names.add(details["Other name(s)"]);
            }
        }
        for (const name of names) {
            const option = document.createElement('option');
            option.value = name.toLowerCase();
            option.textContent = name;
            select.appendChild(option);
        }
    } else {
        const codes = new Set();
        for (const [code, details] of Object.entries(languages.iso3)) {
            if (lookupType === 'iso1' && details["639-1"]) {
                codes.add(details["639-1"]);
            } else if (lookupType === 'iso2B' && details["639-2/B"]) {
                codes.add(details["639-2/B"]);
            } else if (lookupType === 'iso2T' && details["639-2/T"]) {
                codes.add(details["639-2/T"]);
            } else if (lookupType === 'iso3') {
                codes.add(code);
            }
        }
        for (const code of codes) {
            const option = document.createElement('option');
            option.value = code.toLowerCase();
            option.textContent = code;
            select.appendChild(option);
        }
    }
}

function lookupLanguage() {
    const lookupType = document.getElementById('lookupToggle').value;
    const input = document.getElementById('lookupInput').value.trim().toLowerCase();
    let resultText = 'Not found';
    let details = null;

    const newUrl = `${window.location.pathname}?type=${lookupType}&lang=${input}`;
    window.history.pushState({ path: newUrl }, '', newUrl);

    if (lookupType === 'name') {
        for (const [code, detailsObj] of Object.entries(languages.iso3)) {
            if ((detailsObj["Name(s)"] && detailsObj["Name(s)"].toLowerCase() === input) ||
                (detailsObj["Native name(s)"] && detailsObj["Native name(s)"].toLowerCase() === input) ||
                (detailsObj["Other name(s)"] && detailsObj["Other name(s)"].toLowerCase() === input)) {
                details = detailsObj;
                break;
            }
        }
    } else {
        for (const [code, detailsObj] of Object.entries(languages.iso3)) {
            if ((lookupType === 'iso1' && detailsObj["639-1"] && detailsObj["639-1"].toLowerCase() === input) ||
                (lookupType === 'iso2B' && detailsObj["639-2/B"] && detailsObj["639-2/B"].toLowerCase() === input) ||
                (lookupType === 'iso2T' && detailsObj["639-2/T"] && detailsObj["639-2/T"].toLowerCase() === input) ||
                (lookupType === 'iso3' && code.toLowerCase() === input)) {
                details = detailsObj;
                break;
            }
        }
    }

    if (details) {
        const nameLink = `<a rel="nofollow" href="https://www.google.com/search?q=${encodeURIComponent(details["Name(s)"])}" target="_blank">${details["Name(s)"]}</a>`;
        resultText = `<table>
                          <tr><th>Name(s)</th><td>${nameLink}</td></tr>
                          <tr><th>Native name(s)</th><td>${details["Native name(s)"]}</td></tr>
                          <tr><th>Other name(s)</th><td>${details["Other name(s)"]}</td></tr>
                          <tr><th>639-1</th><td>${details["639-1"]}</td></tr>
                          <tr><th>639-2/B</th><td>${details["639-2/B"]}</td></tr>
                          <tr><th>639-2/T</th><td>${details["639-2/T"]}</td></tr>
                          <tr><th>639-3</th><td>${details["639-3"]}</td></tr>
                          <tr><th>Deprecated</th><td>${details["Deprecated"]}</td></tr>
                          <tr><th>Scope</th><td>${details["Scope"]}</td></tr>
                          <tr><th>Type</th><td>${details["Type"]}</td></tr>
                      </table>`;
    }

    document.getElementById('result').innerHTML = resultText;
}

async function fetchLatestCommit() {
    try {
        const response = await fetch('https://api.github.com/repos/thunderpoot/isogloss/commits');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const commits = await response.json();
        if (commits.length === 0) {
            throw new Error('No commits found');
        }
        const latestCommit = commits[0];
        const commitHash = latestCommit.sha.substring(0, 7);
        const commitLink = `https://github.com/thunderpoot/isogloss/commit/${latestCommit.sha}`;

        console.log('Commit Hash:', commitHash);
        console.log('Commit Link:', commitLink);

        document.getElementById('commit-hash').innerText = commitHash;
        document.getElementById('commit-link').href = commitLink;
    } catch (error) {
        console.error('Error fetching latest commit:', error);
        // probably rate–limiting
    }
}

function loadPage() {
    fetchLanguages();
    fetchLatestCommit();
}

window.onload = loadPage;
