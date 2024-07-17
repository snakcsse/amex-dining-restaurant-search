###### Caution: google API fetching code included

## Processing scraped data: remove the word "エリア:" in "area", fetch google maps platform API if googleMapPage info missing, extract coordiantes from googleMapPage
import json
import os 
import requests
from dotenv import load_dotenv
import time

scraped_data_file_path = os.path.join('../data/restaurants.json')
export_data_file_path = os.path.join('../data/processed_restaurants.json')
load_dotenv('../config.env')

#Read scraped .json file
with open(scraped_data_file_path, 'r', encoding='utf-8') as f: 
    data = json.load(f)

processed_data = data

#remove "エリア：" for field 'area'
for dict in processed_data:
    dict['area'] = dict['area'].replace("エリア：", "")
    

#fill up coordinates if googleMapPage is blank
#Access .env variables
api_key = os.getenv('GOOGLE_PLACES_API_KEY_DEV')

res_with_no_coordinates = []
for dict in processed_data:
    if not isinstance(dict['googleMapPage'], str):
        processed_dict = dict.copy()
        processed_dict['index'] =  processed_data.index(dict)
        res_with_no_coordinates.append(processed_dict)

# print(res_with_no_coordinates)

def get_coordinates(restaurant_dict):
    url = 'https://places.googleapis.com/v1/places:searchText'

    payload = {
        "textQuery": restaurant_dict['name']
    }

    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': api_key,
        'X-Goog-FieldMask': 'places.location',
        'includedType': 'Food and Drink',
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        processed_data[restaurant_dict['index']]['location'] = {"type":"Point", "coordinates": [response.json()['places'][0]['location']['latitude'], response.json()['places'][0]['location']['longitude']]}

    else: 
        print('Error', response.status_code, response.text)

#Make POST request to google Maps Platform API to get coordinates of the restaurants with googleMapPage
if len(res_with_no_coordinates) < 3:
    for res_dict in res_with_no_coordinates:
        time.sleep(5) 
        get_coordinates(res_dict)

# print(processed_data[37], processed_data[156])

# extract coordinates from 'googleMapPage'
for dict in processed_data:
    if isinstance(dict['googleMapPage'], str):
        coordinates = dict['googleMapPage'].split('=')[1].split(',')
        dict['location'] = {"type":"Point", "coordinates": [float(coordinates[0]), float(coordinates[1])]}
# print(processed_data[0:2], '\n', processed_data[37], '\n', processed_data[156])

#export processed .json file
with open(export_data_file_path, 'w', encoding='utf-8') as f: 
    json.dump(processed_data, f, ensure_ascii=False, indent=4)