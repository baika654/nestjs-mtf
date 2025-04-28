import { Injectable } from '@nestjs/common';

export type StockInfo = {
  Name: string;
  TickerSymbol: string;
};

type SeriesFormat = {
  [entryTitle: string]: {
    ['1. open']: string;
    ['2. high']: string;
    ['3. low']: string;
    ['4. close']: string;
    ['5. volume']: string;
  }[];
};

type DayData = {
  ['1. open']: string;
  ['2. high']: string;
  ['3. low']: string;
  ['4. close']: string;
  ['5. volume']: string;
};

@Injectable()
export class StocksService {
  private stockList: StockInfo[];

  getStocksList(): StockInfo[] {
    return this.stockList;
  }

  async getStockData(tickerName: string): Promise<string> {
    // Get ticker name data

    const url =
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' +
      tickerName +
      "&outputsize=full&apikey=demo';";
    let result: string = '';

    // Get data from Alpha Vantage and transform.

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      console.log(response);
      const json: unknown = await response.json();
      if (
        json &&
        typeof json === 'object' &&
        json['Time Series (Daily)'] !== undefined
      ) {
        const chartData: unknown = json['Time Series (Daily)'];
        if (chartData && typeof chartData === 'object') {
          const noDateKeyedData = Object.entries(chartData as SeriesFormat).map(
            ([key, value]) => {
              return { name: key, ...(value as unknown as DayData) };
            },
          );
          const arrayData = noDateKeyedData
            .map((obj) => Object.values(obj).slice(0, -1))
            .slice(0, 100);
          console.log(arrayData);
          result = JSON.stringify(arrayData);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        // Narrowing type to Error
        console.error(error.message);
      } else {
        // Handle cases where the thrown value is not an Error object
        console.error('An unknown error occurred:', error);
      }
    }

    return result;
  }
}
