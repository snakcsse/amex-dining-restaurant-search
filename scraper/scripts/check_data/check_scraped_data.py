import json
import os 

file_path = os.path.join('../../data/restaurants.json')

with open(file_path, 'r', encoding='utf-8') as f: 
    data = json.load(f)

# -------------- Check unique #records --------------
unique_records = set([res.get('name') for res in data])
# print(len(unique_records))

# -------------- check ambiguous unicode characeters --------------
# since the .json doc says "This document contains many ambiguous unicode characters. Disable Ambiguous Highlight", check what are those ambiguous characters
import unicodedata

def find_ambiguous_characters(text):
    ambiguous_chars = []
    for char in text:
        if not (unicodedata.category(char).startswith('L') or  # Letter
                unicodedata.category(char).startswith('N') or  # Number
                unicodedata.category(char).startswith('P') or  # Punctuation
                char.isspace()):  # Whitespace
            ambiguous_chars.append(char)
    return ambiguous_chars

def check_ambiguous_characters(obj):
    ambiguous_chars = []
    
    if isinstance(obj, dict):
        for key, value in obj.items():
            ambiguous_chars.extend(check_ambiguous_characters(key))
            ambiguous_chars.extend(check_ambiguous_characters(value))
    
    elif isinstance(obj, list):
        for item in obj:
            ambiguous_chars.extend(check_ambiguous_characters(item))
    
    elif isinstance(obj, str):
        ambiguous_chars.extend(find_ambiguous_characters(obj))
    
    return ambiguous_chars

# Find ambiguous characters in the JSON data
ambiguous_characters = check_ambiguous_characters(data)

# Remove duplicates by converting to a set
unique_ambiguous_characters = set(ambiguous_characters)

# print("Found ambiguous characters:")
# for char in unique_ambiguous_characters:
#     print(f"Character: {char}, Unicode: {ord(char)}")

# those are ~, =, x. These are in "" and are normal data and should not be modified

#check missing googleMapPage
for dict in data:
    if not isinstance(dict['googleMapPage'], str):
        print(dict)

