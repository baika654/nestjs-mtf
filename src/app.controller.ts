import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { StocksService } from './stocksservice/stocksprovider.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private stocksService: StocksService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('allTickers')
  getTickers(): string {
    const tickerData = JSON.stringify(this.stocksService.getStocksList());
    return tickerData;
  }

  //@Get('stockDailyData')
  @Get('stockDailyData/:ticker')
  async getStockData(@Param('ticker') ticker: string): Promise<string> {
  return this.stocksService.getStockData(ticker);
  
  }
}
//getstockData():string {