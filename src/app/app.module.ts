import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExplosionComponent } from './explosion/explosion.component';
import { ComicPanelComponent } from './comic-panel/comic-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    ExplosionComponent,
    ComicPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
