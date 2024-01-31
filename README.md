# Isogloss

### ISO 639 and IETF Language Code Lookup Tool

`isogloss` is a Python-based command-line tool designed for looking up language details based on ISO 639 codes and IETF language tags. It provides comprehensive information about languages, including their names, native names, and additional details associated with each code or tag.

## Features

- Lookup language details using ISO 639-1, 639-2/B, 639-2/T, or 639-3 codes.
- Lookup language details by language name.
- Lookup language details using IETF language tags (e.g., en-GB, en-US).

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/[your-username]/isogloss.git
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

## License

This project is [MIT licensed](https://opensource.org/licenses/MIT).
