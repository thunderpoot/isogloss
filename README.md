![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# 🌐 iso·gloss

### ISO 639 and IETF Language Code Lookup Tool

`isogloss` is a Python–based command–line tool designed for looking up language details based on [ISO 639](https://www.iso.org/iso-639-language-code) codes and IETF ([BCP-47](https://www.rfc-editor.org/info/bcp47)) language tags. It provides comprehensive information about languages, including their names, native names, and additional details associated with each code or tag.

There is also a [web–based version here](https://thunderpoot.github.io/isogloss).

<sub>_Elsewhere, [the word isogloss](https://en.wikipedia.org/wiki/Isogloss) means a boundary line on a map denoting the regional use of a particular linguistic characteristic, but in this case it just seemed to fit._</sub>

## Features

- Lookup language details using ISO 639-1, 639-2/B, 639-2/T, or 639-3 codes.
- Lookup language details by language name.
- Lookup language details using IETF BCP-47 language tags (e.g., en-GB, en-US, sv-SE).

## Installation

Clone the repository to your local machine:

```
git clone https://github.com/thunderpoot/isogloss.git
```

Create a virtual environment and install requirements

```
python3.11 -m venv venv
source venv/bin/activate
pip install unidecode
```

## Usage

The script can be run directly from the command line. Below are some examples of how to use it:

To look up information by ISO 639 code:

```
$ isogloss/isogloss.py -c swe
{
  "639-1": "sv",
  "Scope": "Individual",
  "Type": "Living",
  "Native name(s)": "svenska",
  "Other name(s)": "",
  "639-2/T": "swe",
  "639-2/B": "",
  "639-5": "",
  "639-3": "swe",
  "Name(s)": "Swedish"
}
```

To look up information by language name:

```
$ isogloss/isogloss.py -n "egyptian arabic"
{
    "Egyptian Arabic": "arz"
}
```

Example of lookup via native name:

```
$ isogloss/isogloss.py -n 日本語
{
    "\u65e5\u672c\u8a9e Nihongo": "jpn"
}
```

Example of multiple results being found:

```
$ isogloss/isogloss.py -n norwegian
{
    "Norwegian Nynorsk": "nno",
    "Nynorsk, Norwegian": "nno",
    "Bokm\u00e5l, Norwegian": "nob",
    "Norwegian Bokm\u00e5l": "nob",
    "Norwegian": "nor",
    "Norwegian Sign Language": "nsl",
    "Traveller Norwegian": "rmg"
}
```

Language names are normalised, allowing for case–insensitive and accent–insensitive matching when searching:

```
$ isogloss/isogloss.py -n espanol
{
    "Judeo-espa\u00f1ol": "lad",
    "espa\u00f1ol": "spa"
}
```

To look up information by IETF language tag:

```
$ isogloss/isogloss.py -i fr-FR
{
    "Language": {
        "639-1": "fr",
        "Scope": "Individual",
        "Type": "Living",
        "Native name(s)": "fran\u00e7ais",
        "Other name(s)": "",
        "639-2/T": "fra",
        "639-2/B": "fre",
        "639-5": "",
        "639-3": "fra",
        "Name(s)": "French"
    },
    "Region": "France"
}
```

## Files

- `data/consolidated_langs.json`: Contains language data in JSON format used for the lookup.
- `data/region_names.json`: Contains region data in JSON format used for the IETF tag lookup.
- `data/deprecated-639-3.csv`: Contains deprecated ISO 639-3 codes in CSV format, for quick reference (not used in the code).

## Contributing

Contributions, issues, and feature requests are welcome!

## Author

Written by T E Vaughan

## Standards
Language codes conform to the [ISO 639](https://www.iso.org/iso-639-language-code) standard (introduced in [RFC 4646](https://datatracker.ietf.org/doc/html/rfc4646.html)), and country codes conform to the [ISO 3166-1 alpha-2](https://www.iso.org/iso-3166-country-codes.html) standard (first defined in [RFC 1766](https://www.ietf.org/rfc/rfc1766.txt)).

## License

This project is [MIT licensed](https://opensource.org/licenses/MIT).
