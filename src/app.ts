import axios from 'axios'
import * as cheerio from 'cheerio'
import json2xls = require('json2xls')
import * as fs from 'fs'

/*
{
  found: 1369,
  start: 0,
  cards: [
    {
      id: 14908576,
      url: 'https://asunnot.oikotie.fi/myytavat-asunnot/espoo/14908576',
      description: 'Varsasaari, 02160 Espoo',
      rooms: 1,
      roomConfiguration: '1h + k + s',
      price: '38 000 €',
      nextViewing: null,
      images: [Object],
      newDevelopment: false,
      published: '2019-03-27T15:09:38Z',
      size: 12,
      sizeMin: null,
      sizeMax: null,
      sizeLot: null,
      cardType: 100,
      contractType: 1,
      onlineOffer: null,
      isOnlineOffer: false,
      extraVisibility: false,
      extraVisibilityString: null,
      buildingData: [Object],
      coordinates: [Object],
      brand: [Object],
      priceChanged: null,
      visits: 23139,
      visits_weekly: 883,
      cardSubType: [Array],
      status: 1
    }
  ]
}
*/

interface Credentials {
    'ota-cuid': string
    'ota-token': string
    'ota-loaded': string
}

const login = async (): Promise<Credentials> => {
    const response = await axios.get(`https://asunnot.oikotie.fi/myytavat-asunnot`)
    const $ = cheerio.load(response.data)
    const token = $('meta[name=api-token]').attr('content')
    const cuid = $('meta[name=cuid]').attr('content')
    const loaded = $('meta[name=loaded]').attr('content')

    return {
        'ota-cuid': cuid,
        'ota-token': token,
        'ota-loaded': loaded
    }
}

const cards = async (credentials: Credentials): Promise<Array<any>> => {
    const headers = {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,fi;q=0.8,vi;q=0.7',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        ...credentials
    }

    const limit = 5000

    const { data } = await axios.get(
        `https://asunnot.oikotie.fi/api/cards?buildingType%5B%5D=4&buildingType%5B%5D=8&buildingType%5B%5D=32&buildingType%5B%5D=128&cardType=100&habitationType%5B%5D=1&limit=${limit}&locations=%5B%5B39,6,%22Espoo%22%5D%5D&lotOwnershipType%5B%5D=1&newDevelopment=0&offset=0&price%5Bmin%5D=1&sortBy=published_sort_desc`,
        {
            headers
        }
    )

    data.cards = data.cards.map((card) => {
        card.price = Number(card.price.replace(/\s/g, '').replace('€', ''))
        return card
    })

    return data.cards
}

const run = async () => {
    const credentials = await login()
    const buildingsData = await cards(credentials)

    const xls = json2xls(buildingsData)
    fs.writeFileSync('data.xlsx', xls, 'binary')
}

run()
