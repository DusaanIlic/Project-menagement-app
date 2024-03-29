import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { AddProjectComponent } from '../add-project/add-project.component';

@NgModule({
  declarations: [
    //AddProjectComponent,
    // Ostale komponente koje su deklarisane u ovom modulu
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Uvezeno za korišćenje reaktivnih formulara
    CommonModule, // Uvezeno za korišćenje osnovnih Angular direktiva
  ],
  providers: [],
  //bootstrap: [AddProjectComponent], // AddProjectComponent komponenta koja se pokreće
})
export class ProductsModule {}
