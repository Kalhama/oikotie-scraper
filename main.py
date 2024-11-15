import os
import requests 
from bs4 import BeautifulSoup 
from time import sleep
import math
import urllib
import pandas as pd
from typing import Optional

df: Optional[pd.DataFrame] = None
CSV_PATH = 'file.csv'

def snake_case(str):
    return str.strip().replace(" ", "_").lower().replace('-','_')        

default_headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.5",
    "Sec-GPC": "1",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Priority": "u=0"
}

auth_headers = {
    'OTA-token': None,
    'OTA-loaded': None,
    'OTA-cuid': None
}

def get_wrapper(url, with_authentication):
    headers = {**default_headers}

    if with_authentication:
        headers.update(auth_headers)

    r = requests.get(url,  headers=headers)

    r.raise_for_status()
    
    return r


def authenticate():
    print("authenticating")
    r = get_wrapper('https://asunnot.oikotie.fi', False)

    soup = BeautifulSoup(r.content, 'html.parser')

    auth_headers['OTA-loaded'] = soup.find('meta', {'name': 'loaded'})['content']
    auth_headers['OTA-token'] = soup.find('meta', {'name': 'api-token'})['content']
    auth_headers['OTA-cuid'] = soup.find('meta', {'name': 'cuid'})['content']


def get_retry(url, with_authentication):
    retries = 5
    for i in range(1, retries):
        if (i >= 2 and with_authentication) or (retries == 1 and with_authentication and auth_headers['OTA-token'] == None):
            authenticate()

        try:
            r = get_wrapper(url, with_authentication)

            return r
        except requests.exceptions.RequestException as e:
            if isinstance(e, requests.exceptions.ConnectionError):
                print("Error Connecting:", e)
            elif isinstance(e, requests.exceptions.HTTPError):
                print("Http Error:", e)
            elif isinstance(e, requests.exceptions.Timeout):
                print("Timeout Error:", e)
            else:
                print("OOps: Something Else", e)

            if i == retries:
                return None
            
            sleep(pow(i, 2))


def get_cards(page):
    offset = (page - 1) * 24

    json = get_retry('https://asunnot.oikotie.fi/api/search?cardType=100&limit=24&locations=[[64,6,"Helsinki"],[39,6,"Espoo"],[65,6,"Vantaa"],[130,6,"Kauniainen"]]&offset=' + str(offset) + '&sortBy=published_sort_desc', True).json()

    return json

def get_listing(id):
    if df is None or df.empty or 'id' not in df.columns:
        return None

    row = df[df['id'] == id]
    return row if not row.empty else None


def save_listing(card):    
    data = {
        'address': card['location']['address'],
        'district': card['location']['district'],
        'city': card['location']['city'],
        'zip_code': card['location']['zipCode'],
        'country': card['location']['country'],
        'latitude': card['location']['latitude'],
        'longitude': card['location']['longitude'],
        'published': card['meta']['published'],
        'id': card['cardId'],
    }

    r = get_retry('https://asunnot.oikotie.fi/myytavat-asunnot/espoo/' + str(data['id']), True)
    # very occasionally, search results do not exxist. Just skip them...
    if r is None:
        print("Nothing found, skipping...")
        return None

    html = r.content

    soup = BeautifulSoup(html, 'html.parser')

    rows = soup.find_all(class_='info-table__row')

    for row in rows:
        title = row.find(class_='info-table__title')
        value = row.find(class_='info-table__value')
        if title and value:
            data[snake_case(title.text)] = value.text

    description_div = soup.find('div', class_='listing-overview')
    
    if description_div:
        paragraphs = description_div.find_all('p')
        data["description"] = '\n\n'.join(p.get_text(strip=True) for p in paragraphs)
    else:
        print("No description??")
        data['description'] = ''
    
    global df

    df = pd.concat([df, pd.DataFrame([data])], ignore_index=True)
    df.to_csv("file.csv", index=False)

def initialize_df():
    global df
    if df is not None:
        return

    try:
        df = pd.read_csv(CSV_PATH)
    except Exception as e:
        df = pd.DataFrame()

def main():    
    authenticate()

    page, total_pages = (1, 1)

    initialize_df()

    while page <= total_pages:
        print(f"Processing page {page} of {total_pages}")
        resp = get_cards(page)
        total_pages = math.ceil(resp["found"] / 24)
        
        for card in resp["cards"]:
            listing = get_listing(card['cardId'])
            if listing is None:
                print(f"Saving {card['cardId']}. Shape: {df.shape}")
                listing = save_listing(card)
                sleep(1)
            else:
                print(f"Already exists, skipping {card['cardId']}")

        page = page + 1

        # for debugging
        # if page > 5:
        #     break


if __name__ == "__main__":
    main()
