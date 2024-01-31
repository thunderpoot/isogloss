# Isogloss

### ISO 639 and IETF Language Code Lookup Tool

`isogloss` is a Python-based command-line tool designed for looking up language details based on ISO 639 codes and IETF language tags. It provides comprehensive information about languages, including their names, native names, and additional details associated with each code or tag.

## Features

- Lookup language details using ISO 639-1, 639-2/B, 639-2/T, or 639-3 codes.
- Lookup language details by language name.
- Lookup language details using IETF language tags (e.g., en-GB, en-US).

## Installation

Clone the repository to your local machine:

```
git clone https://github.com/thunderpoot/isogloss.git
cd isogloss
```

## Usage

The script can be run directly from the command line. Below are some examples of how to use it:

To look up information by ISO 639 code:

```bash
./isogloss.py -c [code]
```

To look up information by language name:

```bash
./isogloss.py -n [language name]
```

Example of lookup via native name:

```
./isogloss.py -n 日本語
{
    "\u65e5\u672c\u8a9e Nihongo": "jpn"
}
```

Example of multiple results being found:

```
./isogloss.py -n norwegian
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

To look up information by IETF language tag:

```bash
./isogloss.py -i [ietf tag]
```

For help, refer to the manfile:

```bash
man ./isogloss.1
```


## Files

- `consolidated_langs.json`: Contains language data in JSON format used for the lookup.
- `region_names.json`: Contains region data in JSON format used for the IETF tag lookup.

## Contributing

Contributions, issues, and feature requests are welcome!

## Author

Written by T E Vaughan

## Standards
Language codes conform to the [ISO 639](https://www.iso.org/iso-639-language-code) standard (introduced in [RFC 4646](https://datatracker.ietf.org/doc/html/rfc4646.html)), and country codes conform to the [ISO 3166-1 alpha-2](https://www.iso.org/iso-3166-country-codes.html) standard (first defined in [RFC 1766](https://www.ietf.org/rfc/rfc1766.txt)).

## License

This project is [MIT licensed](https://opensource.org/licenses/MIT).
