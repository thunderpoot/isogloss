"""
Isogloss: A program to lookup languaes by ISO639 code or by IETF tag.
"""

import argparse
import json
import os
import sys

from unidecode import unidecode

def load_json_data(file_name):
    """Load JSON data from a file located in the 'data' directory."""
    dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    file_path = os.path.join(dir_path, 'data', file_name)

    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def parse_ietf_tag(tag):
    """Parse an IETF language tag into its components."""
    components = tag.split('-')
    return {
        'language': components[0],
        'region': components[1] if len(components) > 1 else None
    }

def is_valid_ietf_tag(tag):
    """Validate IETF tag format"""
    if '-' not in tag:
        return False, "Invalid IETF tag format"

    language, _, region = tag.partition('-')
    if len(language) != 2 or not language.isalpha():
        return False, "Invalid language code in IETF tag: must be a two-character ISO 639-1 code"

    if region and (len(region) != 2 or not region.isalpha()):
        return False, "Invalid region code in IETF tag: must be a two-character ISO 3166-1 alpha-2 region code"

    return True, "Valid IETF tag."

def lookup_ietf_locale(tag, lang_data, region_data):
    """Look up the meaning of each component in an IETF locale tag."""
    parsed_tag = parse_ietf_tag(tag)
    results = {}

    # Language lookup
    language = parsed_tag['language']
    language_details = lookup_language_by_code(language, lang_data)
    results['Language'] = language_details if language_details else 'Unknown Language'

    # Region lookup
    if parsed_tag['region']:
        region = parsed_tag['region']
        region_name = region_data.get(region.upper(), 'Unknown Region')
        results['Region'] = region_name

    return results

def search_in_dictionary(search_term, data):
    """Search for 'search_term' in 'data' dictionary."""
    results = {}
    normalized_search_term = unidecode(search_term).lower()
    for key, value in data.items():
        normalized_key = unidecode(key).lower()
        if normalized_search_term in normalized_key:
            results[key] = value
    return results

def lookup_language_by_code(code, data):
    """Look up language details by ISO code."""
    code = code.lower()
    details = {}

    if code in data['iso1']:
        details = data['iso3'][data['iso1'][code]]
    elif code in data['iso2T']:
        details = data['iso3'][data['iso2T'][code]]
    elif code in data['iso2B']:
        details = data['iso3'][data['iso2B'][code]]
    elif code in data['iso3']:
        details = data['iso3'][code]

    return details if details else None

def lookup_language_by_name(name, data):
    """Look up ISO code by language name."""
    for key in ['names', 'other_names', 'native_names']:
        result = search_in_dictionary(name, data[key])
        if result:
            return result
    return None

def main():
    parser = argparse.ArgumentParser(description='ISO 639 and IETF Language Code Lookup Tool')
    parser.add_argument('-c', '--code', help='Lookup by ISO 639-1, 639-2/B, 639-2/T, or 639-3 code')
    parser.add_argument('-n', '--name', help='Lookup by language name')
    parser.add_argument('-i', '--ietf', help='Lookup by IETF language tag (e.g., en-GB, en-US)')

    args = parser.parse_args()
    language_data = load_json_data('consolidated_langs.json')
    region_data = load_json_data('region_names.json')

    if args.ietf:
        valid_tag, message = is_valid_ietf_tag(args.ietf)
        if not valid_tag:
            print(json.dumps({"Error": message}, indent=4))
        else:
            results = lookup_ietf_locale(args.ietf, language_data, region_data)
            print(json.dumps(results, indent=4))
    elif args.code:
        result = lookup_language_by_code(args.code, language_data)
        if result:
            print(json.dumps(result, indent=4))
        else:
            print(json.dumps({"Error": "Language code not found."}, indent=4))
    elif args.name:
        result = lookup_language_by_name(args.name, language_data)
        if result:
            print(json.dumps(result, indent=4))
        else:
            print(json.dumps({"Error": "Language name not found."}, indent=4))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
