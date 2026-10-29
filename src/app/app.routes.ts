import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VideosComponent } from './videos/videos.component';
import { ChartsComponent } from './charts/charts.component';
import { NewsComponent } from './news/news.component';
import { RegulationsComponent } from './regulations/regulations.component';
import { MovementsComponent } from './movements/movements.component';
import { MarketsComponent } from './markets/markets.component';
import { AiInsightsComponent } from './ai-insights/ai-insights.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'charts', component: ChartsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'regulations', component: RegulationsComponent },
  { path: 'movements', component: MovementsComponent },
  { path: 'markets', component: MarketsComponent },
  { path: 'ai', component: AiInsightsComponent },
  { path: '**', redirectTo: '' }
];
