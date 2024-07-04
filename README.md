![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

# 🌐 iso·gloss

![isogloss](isogloss.jpg)

### ISO 639 and IETF Language Code Lookup Tool

`isogloss` is a Python–based command–line tool designed for looking up language details based on [ISO 639](https://www.iso.org/iso-639-language-code) codes and IETF ([BCP-47](https://www.rfc-editor.org/info/bcp47)) language tags. It provides comprehensive information about languages, including their names, native names, and additional details associated with each code or tag.

There is also a [web–based version here](https://thunderpoot.github.io/isogloss).

<sub>_Elsewhere, [the word isogloss](https://en.wikipedia.org/wiki/Isogloss) means a boundary line on a map denoting the regional use of a particular linguistic characteristic, but in this case it just seemed to fit._</sub>

## Features

- Lookup language details using ISO 639-1, 639-2/B, 639-2/T, or 639-3 codes.
- Lookup language details by language name.
- Lookup language details using IETF BCP-47 language tags (e.g., en-GB, en-US, sv-SE, zh-cmn-Hans-CN-pinyin-ud1-p9t4-x-private1 and so on).

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

```
$ isogloss/isogloss.py -i zh-cmn-Hans-CN-pinyin-ud1-p9t4-x-private1
{
    "Primary Language": {
        "639-1": "zh",
        "639-2/B": "chi",
        "639-2/T": "zho",
        "639-3": "zho",
        "639-5": "",
        "Deprecated": false,
        "Name(s)": "Chinese",
        "Native name(s)": "\u4e2d\u6587 Zh\u014dngw\u00e9n; \u6c49\u8bed; \u6f22\u8a9e H\u00e0ny\u01d4",
        "Other name(s)": "",
        "Scope": "Macrolanguage",
        "Type": "Living"
    },
    "Extended Languages": [
        {
            "639-1": "",
            "639-2/B": "",
            "639-2/T": "",
            "639-3": "cmn",
            "639-5": "",
            "Deprecated": false,
            "Name(s)": "Mandarin Chinese",
            "Native name(s)": "",
            "Other name(s)": "",
            "Scope": "Individual",
            "Type": "Living"
        }
    ],
    "Script": "Han (Simplified variant)",
    "Region": "China",
    "Variant": "pinyin",
    "Extension": "ud1-p9t4",
    "Private Use": "x-private1"
}
```

## Files

- `data/consolidated_langs.json`: Contains language data in JSON format used for the lookup.
- `data/region_names.json`: Contains region data in JSON format used for the BCP47 lookup.
- `data/script_codes.json`: Contains script code data in JSON format used for the BCP47 lookup.
- `data/deprecated-639-3.csv`: Contains deprecated ISO 639-3 codes in CSV format, for quick reference.

## Contributing

Contributions, issues, and feature requests are welcome!

## Author

Written by T E Vaughan

## Sponsorship

[![Github-sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/thunderpoot)

If you find this project useful, please consider sponsoring my work. <3

## Related Standards and RFCs

The codes used in this program conform to the following ISO standards:

### Standards

- [ISO 639](https://www.iso.org/iso-639-language-code) Language codes
- [ISO 3166-1 alpha-2](https://www.iso.org/iso-3166-country-codes.html) Country codes
- [ISO 15924](https://www.unicode.org/iso15924/) Script codes

### RFCs

- [RFC 1766](https://www.ietf.org/rfc/rfc1766.txt) Tags for the Identification of Languages
- [RFC 4646](https://www.ietf.org/rfc/rfc4646.txt) Tags for Identifying Languages
- [RFC 4647](https://www.ietf.org/rfc/rfc4647.txt) Matching of Language Tags

## License

This project is [MIT licensed](https://opensource.org/licenses/MIT).
