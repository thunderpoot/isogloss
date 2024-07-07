function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const mode = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    document.getElementById('dark-mode-toggle').innerText = mode === 'dark' ? 'Light' : 'Dark';
}

const lightModeText = 'Light';
const darkModeText = 'Dark';

const toggleButton = document.getElementById('dark-mode-toggle');

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    toggleButton.innerText = lightModeText;
} else {
    toggleButton.innerText = darkModeText;
}

document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('bcp47Input');

    // Add event listener to update URL parameter on input
    inputElement.addEventListener('input', () => {
        const query = inputElement.value;
        const newUrl = `${window.location.pathname}?query=${encodeURIComponent(query)}`;
        window.history.replaceState(null, '', newUrl);
        processTag();
    });

    // Load data and then check URL parameter
    Promise.all([
        fetch('../docs/consolidated_langs.json').then(response => response.json()),
        fetch('../data/script_codes.json').then(response => response.json()),
        fetch('../data/region_names.json').then(response => response.json())
    ])
    .then(([langs, scripts, regions]) => {
        languageData = langs;
        scriptData = scripts;
        regionData = regions;

        // Now check for URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('query');
        if (queryParam) {
            inputElement.value = queryParam;
            processTag();
        }
    })
    .catch(error => console.error('Error fetching the language data:', error));
});

let languageData = {};
let scriptData = {};
let regionData = {};

function lookupLanguageByCode(code) {
    if (languageData.iso3[code]) {
        return languageData.iso3[code];
    }
    if (languageData.iso1[code]) {
        const iso2TCode = languageData.iso1[code];
        return languageData.iso3[iso2TCode];
    }
    if (languageData.iso2B[code]) {
        const iso2TCode = languageData.iso2B[code];
        return languageData.iso3[iso2TCode];
    }
    if (languageData.iso2T[code]) {
        return languageData.iso3[code];
    }
    return null;
}

function parseIetfTag(tag) {
    const components = tag.split('-');
    const result = {
        primaryLang: lookupLanguageByCode(components[0]),
        extLangs: [],
        script: null,
        region: null,
        variant: null,
        extension: null,
        private: null
    };
    let idx = 1;

    // Extended language subtags
    while (idx < components.length && components[idx].length === 3) {
        result.extLangs.push(lookupLanguageByCode(components[idx].toLowerCase()));
        idx += 1;
    }

    // Script
    if (idx < components.length && components[idx].length === 4 && /^[a-zA-Z]+$/.test(components[idx])) {
        result.script = components[idx];
        idx += 1;
    }

    // Region
    if (idx < components.length && (components[idx].length === 2 || /^\d+$/.test(components[idx]))) {
        result.region = components[idx];
        idx += 1;
    }

    // Variants and extensions
    const variantList = [];
    const extensionList = [];
    while (idx < components.length) {
        if (components[idx].startsWith('x')) {
            result.private = components.slice(idx).join('-');
            break;
        } else if (components[idx].startsWith('r') || components[idx].startsWith('g')) {
            extensionList.push(components[idx]);
        } else {
            if (!result.variant) {
                result.variant = components[idx];
            } else {
                extensionList.push(components[idx]);
            }
        }
        idx += 1;
    }

    if (extensionList.length > 0) {
        result.extension = extensionList.join('-');
    }

    return result;
}

function highlightTag(input) {
    if (!input)
    {
        document.getElementById('highlightedInput').innerHTML = '';
        return;
    }
    const regex = /^(?:(?<grandfathered>(?<irregular>en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(?<regular>art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang))|(?:(?:(?<language>[a-z]{2,3})(?:-(?<extlang>([a-z]{3}))){0,3})|(?<language>[a-z]{4})|(?<language>[a-z]{5,8}))(?:-(?<script>[a-z]{4}))?(?:-(?<region>[a-z]{2}|[0-9]{3}))?(?:-(?<variant>([a-z0-9]{5,8}|[0-9][a-z0-9]{3})))*?(?:-(?<extensions>[a-wy-z0-9]-(?:[a-z0-9]{2,8})+))*?(?:-x-(?<privateuse>([a-z0-9]{1,8}(?:-[a-z0-9]{1,8})*))?)?|x-(?<privateuse>([a-z0-9]{1,8}(?:-[a-z0-9]{1,8})*)))$/i;
    const match = input.match(regex);

    if (!match) {
        document.getElementById('highlightedInput').innerHTML = '<span class="warning">⚠️ Invalid BCP47 tag</span>';
        return;
    }

    const {
        language, extlang, script, region, variant, extensions, privateuse
    } = match.groups;

    let highlightedHtml = '';

    if (language) {
        highlightedHtml += `<span class="primary-language">${language}</span>`;
    }
    if (extlang) {
        const extlangs = extlang.split('-');
        extlangs.forEach(el => {
            highlightedHtml += `<span class="hyphen">-</span><span class="extended-language">${el}</span>`;
        });
    }
    if (script) {
        highlightedHtml += `<span class="hyphen">-</span><span class="script">${script}</span>`;
    }
    if (region) {
        highlightedHtml += `<span class="hyphen">-</span><span class="region">${region}</span>`;
    }
    if (variant) {
        const variants = variant.split('-');
        variants.forEach(v => {
            highlightedHtml += `<span class="hyphen">-</span><span class="variant">${v}</span>`;
        });
    }
    if (extensions) {
        const extensionParts = extensions.split('-');
        extensionParts.forEach((ext, index) => {
            if (index % 2 === 0) {
                highlightedHtml += `<span class="hyphen">-</span><span class="extension">${ext}`;
            } else {
                highlightedHtml += `<span class="hyphen">-</span>${ext}</span>`;
            }
        });
    }
    if (privateuse) {
        highlightedHtml += `<span class="hyphen">-</span><span class="private-use">x-${privateuse}</span>`;
    }

    document.getElementById('highlightedInput').innerHTML = highlightedHtml;
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

function processTag() {
    const input = document.getElementById('bcp47Input').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    highlightTag(input);

    const parsedTag = parseIetfTag(input);
    let html = '';

    // Process Primary Language
    if (parsedTag.primaryLang) {
        html += `<div class="section primary-language">
            <strong>Primary Language:</strong> ${parsedTag.primaryLang["Name(s)"]}
            <ul>
                <li>639-1: ${parsedTag.primaryLang["639-1"] || ''}</li>
                <li>639-2/B: ${parsedTag.primaryLang["639-2/B"] || ''}</li>
                <li>639-2/T: ${parsedTag.primaryLang["639-2/T"] || ''}</li>
                <li>639-3: ${parsedTag.primaryLang["639-3"]}</li>
                <li>Native name(s): ${parsedTag.primaryLang["Native name(s)"]}</li>
            </ul>
        </div>`;
    }

    // Process Extended Languages
    if (parsedTag.extLangs.length > 0) {
        const extendedLanguagesHtml = parsedTag.extLangs.map(lang => {
            if (lang) {
                return `<li>${lang["Name(s)"]} (${lang["639-3"]})</li>`;
            }
            return '';
        }).join('');
        html += `<div class="section extended-language">
            <strong>Extended Languages:</strong>
            <ul>${extendedLanguagesHtml}</ul>
        </div>`;
    }

    // Process Script
    if (parsedTag.script) {
        html += `<div class="section script"><strong>Script:</strong> ${scriptData[parsedTag.script]}</div>`;
    }

    // Process Region
    if (parsedTag.region) {
        html += `<div class="section region"><strong>Region:</strong> ${regionData[parsedTag.region]}</div>`;
    }
    // Process Variant
    if (parsedTag.variant) {
        html += `<div class="section variant"><strong>Variant:</strong> ${parsedTag.variant}</div>`;
    }

    // Process Extension
    if (parsedTag.extension) {
        html += `<div class="section extension"><strong>Extension:</strong> ${parsedTag.extension}</div>`;
    }

    // Process Private Use
    if (parsedTag.private) {
        html += `<div class="section private-use"><strong>Private Use:</strong> ${parsedTag.private}</div>`;
    }

    resultDiv.innerHTML = html;
}

async function fetchLanguages() {
    Promise.all([
        fetch('../docs/consolidated_langs.json').then(response => response.json()),
        fetch('../data/script_codes.json').then(response => response.json()),
        fetch('../data/region_names.json').then(response => response.json())
    ])
    .then(([langs, scripts, regions]) => {
        languageData = langs;
        scriptData = scripts;
        regionData = regions;
    })
    .catch(error => console.error('Error fetching the language data:', error));
}

function loadPage() {
    fetchLanguages();
    // fetchLatestCommit();
}

window.onload = loadPage;
