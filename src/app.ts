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

interface ICredentials {
    'ota-cuid': string
    'ota-token': string
    'ota-loaded': string
}

const login = async (): Promise<ICredentials> => {
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

const cards = async (credentials: ICredentials): Promise<Array<any>> => {
    const headers = {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,fi;q=0.8,vi;q=0.7',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        ...credentials
    }

    const limit = 5000

    let { data: { cards } } = await axios.get(
        'https://asunnot.oikotie.fi/api/cards?buildingType%5B%5D=1&buildingType%5B%5D=256&cardType=100&habitationType%5B%5D=1&limit=5000&locations=%5B%5B39,6,%22Espoo%22%5D,%5B64,6,%22Helsinki%22%5D,%5B65,6,%22Vantaa%22%5D,%5B147,6,%22Kirkkonummi%22%5D%5D&newDevelopment=1&offset=0&sortBy=published_sort_desc',
        {
            headers
        }
    )

    const formatPrice = (price: string) => {
        return Number(String(price).replace(/\s/g, '').replace('€', '').replace(',','.'))
    }

    cards = cards.map((card) => {
        card.price = formatPrice(card.price)
        
        return card
    })

    const delay = (ms: number) => {
        new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve()
            }, ms)
        })
    }

    for (const [i, val] of cards.entries()) {
        cards[i].salePrice = formatPrice(await getSalePrice(val.url, credentials))

        console.log(i + 1, cards.length);
    }

    return cards
}

const getSalePrice = async (url: string, credentials: ICredentials) => {
    const headers = {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9,fi;q=0.8,vi;q=0.7',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        ...credentials
    }

    const limit = 5000

    const data = await axios.get(
        url,
        {
            headers
        }
    ).then(res => res.data).catch(() => console.error("error with", url))

    const $ = cheerio.load(data)
    const selectedElement = $('.info-table .info-table__value').filter(function() {
        return $(this).prev().text() === 'Myyntihinta'; // Filter based on the sibling's text
    })
    
    return selectedElement.text()
}

const run = async () => {
    const credentials = await login()
    const buildingsData = await cards(credentials)
    // await house('https://asunnot.oikotie.fi/myytavat-asunnot/espoo/17483278', credentials)

    const xls = json2xls(buildingsData)

    fs.writeFileSync('data.xlsx', xls, 'binary')
    console.log("DONE");
    process.exit()
}

run()
