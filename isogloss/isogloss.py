#!/usr/bin/env python3

"""
Isogloss: A program to lookup languaes by ISO639 code or by IETF tag.
"""

import argparse
import json
import os
import re

from unidecode import unidecode

def load_json_data(file_name):
    """Load JSON data from a file located in the 'data' directory."""
    dir_path = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
    file_path = os.path.join(dir_path, 'data', file_name)

    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def parse_ietf_tag(tag, language_data):
    components = tag.split('-')
    result = {
        'primaryLang': components[0],
        'extLangs': [],
        'script': None,
        'region': None,
        'variant': None,
        'extension': None,
        'private': None
    }
    idx = 1

    # Extended language subtags
    while idx < len(components) and len(components[idx]) == 3:
        result['extLangs'].append(lookup_language_by_code(components[idx].lower(), language_data))
        idx += 1

    # Script
    if idx < len(components) and len(components[idx]) == 4 and components[idx].isalpha():
        result['script'] = components[idx]
        idx += 1

    # Region
    if idx < len(components) and (len(components[idx]) == 2 or components[idx].isdigit()):
        result['region'] = components[idx]
        idx += 1

    # Variants and extensions
    variant_list = []
    extension_list = []
    while idx < len(components):
        if components[idx].startswith('x'):
            result['private'] = '-'.join(components[idx:])
            break
        elif components[idx].startswith('r') or components[idx].startswith('g'):
            extension_list.append(components[idx])
        else:
            if result['variant'] is None:
                result['variant'] = components[idx]
            else:
                extension_list.append(components[idx])
        idx += 1

    if extension_list:
        result['extension'] = '-'.join(extension_list)

    return result

def is_valid_ietf_tag(tag):
    pattern = re.compile(
        r'^([a-z]{2,3})'                       # ISO 639 language code
        r'(-[A-Z][a-z]{3})?'                   # ISO 15924 script code (optional)
        r'(-([A-Z]{2}|\d{3}))?'                # ISO 3166 region or UN M.49 (optional)
        r'(-[a-zA-Z0-9]+)*'                    # Variants (optional)
        r'(-x(-[a-zA-Z0-9]+)+)?$',             # Private use (optional, starts with 'x-')
        re.IGNORECASE                          # Case insensitive matching
    )
    return pattern.match(tag) is not None, "Tag validation failed."

def lookup_script_by_code(code, data):
    return data.get(code, 'Unknown Script')

def lookup_ietf_locale(tag, language_data, region_data, script_data):
    parsed_tag = parse_ietf_tag(tag, language_data)

    result = {
        'Primary Language': lookup_language_by_code(parsed_tag['primaryLang'].lower(), language_data)
    }

    if parsed_tag['extLangs']:
        result['Extended Languages'] = parsed_tag['extLangs']
    if parsed_tag['script']:
        result['Script'] = lookup_script_by_code(parsed_tag['script'], script_data)
    if parsed_tag['region']:
        region_name = region_data.get(parsed_tag['region'].upper(), 'Unknown Region')
        result['Region'] = region_name
    if parsed_tag['variant']:
        result['Variant'] = parsed_tag['variant']
    if parsed_tag['extension']:
        result['Extension'] = parsed_tag['extension']
    if parsed_tag['private']:
        result['Private Use'] = parsed_tag['private']

    return result

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
    script_data = load_json_data('script_codes.json')

    if args.ietf:
        valid_tag, message = is_valid_ietf_tag(args.ietf)
        if not valid_tag:
            print(json.dumps({"Error": message}, indent=4))
        else:
            results = lookup_ietf_locale(args.ietf, language_data, region_data, script_data)
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
