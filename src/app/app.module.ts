import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExplosionComponent } from './explosion/explosion.component';
import { ComicPanelComponent } from './comic-panel/comic-panel.component';
import { FaceDetectionComponent } from './face-detection/face-detection.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ExplosionComponent,
    ComicPanelComponent,
    FaceDetectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
