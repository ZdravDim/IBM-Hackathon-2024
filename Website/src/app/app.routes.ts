import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { MainComponent } from '../main/main.component';
import { SummarizationComponent } from '../main/summarization/summarize.component';
import { ChatComponent } from '../main/chat/chat.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: '', component: MainComponent, children: [
        { path: 'chat', component: ChatComponent },
        { path: 'summarization', component: SummarizationComponent },
    ]},
    { path: '**', redirectTo: '' }
];
