import requests 
from bs4 import BeautifulSoup
import time
import re
import json
import os
import math

BASE_URL = "https://syotaibiyori.com/restaurant/jp_ja/country/JP"
HOST_URL = "https://syotaibiyori.com"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
} # for setting the HTTP headers for the requests - makes your requests like from a real web browser -> can avoid being blocked and can bypass some anti-scraping measures

all_restaurants = [] #for storing info (name, area, cuisine type, etc.) for each restaurant as an object
numResPerPage = 20
def remove_bracket(string):
    return string.replace('（', '').replace('）', '').replace('(', '')

#general function to be reused for scraping
def get_soup(url):
    try:
        response = requests.get(url)
        response.raise_for_status() #raise an exception if the HTTP request returned an unsuccessful status code - if status code is 4xx or 5xx, will raise an 'HTTPError' exception- useful for error handling
        return BeautifulSoup(response.text, 'html.parser') #.text for HTML or JSON as text, .content for binary data such as images, PDF, any other non-textual content
    except requests.exceptions.HTTPError as http_err:  #specific exception type provided by the 'requests' library - raises for HTTP errors
        print(f"HTTP error occurred: {http_err}")
    except Exception as err:  # includes other built-in exceptions such as TypeError, ValueError etc.
        print(f"An error occurred: {err}")
    return None

#scrape page links
def get_page_links(base_url):
    soup = get_soup(base_url)
    if soup:
        # CANNOT extract all pages (only page 1-5) so didn't use the below codes
        # links = soup.select('ul.pager-link li a[href]') #returns a list of the <a href='xx'> #selecting all <a> with href attribute -> child of li -> child of ul with class pager-link #.select allows extracting using CSS syntax 
        # page_links = []
        # page_links.append(BASE_URL)
        # for link in links:
        #     page_links.append(HOST_URL + link['href'])
        # print(page_links)
        # return page_links
        totalRestaurant = int(re.sub(r'\D', '',soup.select_one('span.pager-text-total').text)) #extracting total #Restaurants, removing "全" and "件"; \D means non-numeric characters
        totalPages = math.floor(totalRestaurant/numResPerPage) + (1 if totalRestaurant % numResPerPage > 0 else 0) - 1 # -1 to exclue the first page
        page_links = []
        page_links.append(BASE_URL)
        i = 2
        while totalPages > 0:
            page_links.append(BASE_URL + '?I=' + str(i) + '1' + '&O=SA')  #all pages have the same format
            i = i + 2
            totalPages -= 1
        return page_links

def scrape_restaurants_links_name_type_area(page_link):
    soup = get_soup(page_link)
    if soup:
        restaurants_list = soup.select('div.restaurantlist-textbox')

        #since not sure if each page has the below info, use lambda x to assign None if no data
        attribute_mapping = {
            "name": ("a", lambda x: x.text.strip() if x else None), #.strip remove leadning and trailing whitespaces
            "area": ("div.restaurantlist-area", lambda x: remove_bracket(x.text.strip()) if x else None ), 
            "cuisineType": ("span", lambda x: remove_bracket(x.text.strip()) if x else None),
            "resPage": ("a", lambda x: (HOST_URL + x.get('href')) if x else None) #the extracted url only contains the relative url without the host, so here concatenate the host
        }

        #loop through extracted section of each restaurant in the specific page and 
        for restaurant in restaurants_list:
            restaurant_info = {}
            for key, (selector, extractor) in attribute_mapping.items():
                element = restaurant.select_one(selector)
                restaurant_info[key] = extractor(element)  #using the lambda function to either return the processed string or None in case element is None
            all_restaurants.append(restaurant_info)    
        return all_restaurants

def scrape_restaurants_details():
    print('Scraping all page links...')
    page_links = get_page_links(BASE_URL)  #extract the links of each page into a list and assign to page_links variable
    print('Scraping restaurant basic info from each page link...')
    for page_link in page_links: #scrape restaruant basic info from each page
        scrape_restaurants_links_name_type_area(page_link) 
        # print(len(all_restaurants))       
        time.sleep(1) #to avoid overwhelming the server with requests - delay of 1 second between each page scrape
    print('Scraping detailed information of each restaurant from the restaurant page...')
    # for restaurant in all_restaurants[0:1]: 
    for restaurant in all_restaurants:  #scrape detailed restaurant inforamtion 
        time.sleep(1)
        # print(restaurant['restaurant_detail_page'])  
        soup = get_soup(restaurant['resPage'])

        attribute_mapping = {
            "address": ('div.restaurant-detailtable-data', lambda x: re.sub(r'\r[\s\S]*', '', x.text.strip()) if x else None), #use Regex to replace address content since the address is like '北海道札幌市中央区南2条西1 アスカビル2F\r\n\r\n\r\n\nGoogle Mapsで開く »' #\S matches any non-whitespace character (everything except spaces, tabs, newlines, etc.), \s matches any whitespaces (if use . in [], it will literally match a dot)
            "googleMapPage": ('div.restaurant-detailtable-maplink a', lambda x: x.get('href') if x else None),
            "catchCopy":('div.restaurant-lead-catchcopy', lambda x: x.text.strip() if x else None),
            "access": ('div.restaurant-detailtable-data', lambda x: re.sub(r'\n', '', x[1].text.strip()) if x else None),
            "discountTimePeriod": ('div.restaurant-detailtable-data', lambda x: x[2].text.strip() if x else None),
            "discountExcludeDay": ('div.restaurant-detailtable-data', lambda x: x[3].text.strip() if x else None),
            "closeDay": ('div.restaurant-detailtable-data', lambda x: x[5].text.strip() if x else None),
            "lunchDiscount": ('div.restaurant-detailtable-data', lambda x: x[6].text.strip() if x else None)
        }

        if soup:
            for key, (selector, extractor) in attribute_mapping.items():
                if key == 'address' or key == 'googleMapPage' or key == 'catchCopy':
                    element = soup.select_one(selector)
                    restaurant[key] = extractor(element) 
                else:
                    element = soup.find_all(selector.split('.')[0], class_=selector.split('.')[1])
                    restaurant[key] = extractor(element)
    return all_restaurants

all_restaurants = scrape_restaurants_details()
# print(all_restaurants)

#Define the path where JSON file will be saved
file_path = os.path.join("..", "data", "restaurants.json")

#Save to JSON file
with open(file_path, 'w', encoding='utf-8') as f: 
    json.dump(all_restaurants, f, ensure_ascii=False, indent=4)  #ensure_ascii=False: default is True. If False, non-ASCII characters (like Japanese, Chinese) will not be escaped (converted into their Unicode escape characters e.g. \uXXXX) and written as-is #json.dump (json is a python module, JSON is a JS object) is similar to JSON.stringify (this is called serialize - process of converting an object into a format that can be easily stored and transferred)


