# oikotie-scraper

Scrapes oikotie.fi

- persist data into postgresql database
- resume scraping after error

## How to start developing

1. craete python env `python3 -m venv env`
2. start env `source env/bin/activate`
3. Install dependenceis `pip install -r requirements.txt`
4. `cp example.env .env` and set your env variables
5. start developing. I recommend `npx nodemon main.py`
