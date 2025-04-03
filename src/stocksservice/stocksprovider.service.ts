import {Injectable} from '@nestjs/common'


export type StockInfo = {
    Name: String;
    TickerSymbol: String;
};

@Injectable()

export class StocksService {
    
    private stockList: StockInfo[];
    
    getStocksList(): StockInfo[] {
        return this.stockList;
    }

    async getStockData(tickerName:string): Promise<string> {
        
        // Get ticker name data
        
        const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + tickerName + "&outputsize=full&apikey=demo';"
        var result:string= "";
        
        // Get data from Alpha Vantage and transform.

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Response status: ${respnse.status}');
            }
            const json = await response.json();
            const chartData = json['Time Series (Daily)'];
            const noDateKeyedData = Object.entries(chartData).map(([key, value]) => {
                return {name: key, ...value as unknown as object,};})
            const arrayData = noDateKeyedData.map((item) => JSON.parse('["' + item['name'] + '" , ' + item['1. open'] + ' , ' + item['2. high'] + ' , ' + item['3. low']  + ' , ' + item['4. close'] + ']') ).slice(0,100);
            console.log(arrayData);
            result = JSON.stringify(arrayData);
        } catch (error) {
            console.error(error.message);
        }
            
        return result;

    }
}