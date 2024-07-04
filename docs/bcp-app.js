let languageData = {};
let scriptData = {};
let regionData = {};

// Fetch the language data from the JSON files
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
    const components = input.split('-');
    let highlightedHtml = '';

    // Highlight each component with the appropriate colour
    if (components[0]) {
        highlightedHtml += `<span class="primary-language">${components[0]}</span>`;
    }
    let idx = 1;

    // Highlight extended languages
    while (idx < components.length && components[idx].length === 3) {
        highlightedHtml += `-<span class="extended-language">${components[idx]}</span>`;
        idx += 1;
    }

    // Highlight script
    if (idx < components.length && components[idx].length === 4 && /^[a-zA-Z]+$/.test(components[idx])) {
        highlightedHtml += `-<span class="script">${components[idx]}</span>`;
        idx += 1;
    }

    // Highlight region
    if (idx < components.length && (components[idx].length === 2 || /^\d+$/.test(components[idx]))) {
        highlightedHtml += `-<span class="region">${components[idx]}</span>`;
        idx += 1;
    }

    // Highlight variants and extensions
    while (idx < components.length) {
        if (components[idx].startsWith('x')) {
            highlightedHtml += `-<span class="private-use">${components.slice(idx).join('-')}</span>`;
            break;
        } else if (components[idx].startsWith('r') || components[idx].startsWith('g')) {
            highlightedHtml += `-<span class="extension">${components[idx]}</span>`;
        } else {
            highlightedHtml += `-<span class="variant">${components[idx]}</span>`;
        }
        idx += 1;
    }

    document.getElementById('highlightedInput').innerHTML = highlightedHtml;
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
