import { Component, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pet } from './models/pet';
import { PetsService } from './services/pets.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EditPetComponent } from './components/edit-pet/edit-pet.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HttpClientModule,
    EditPetComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Pets.UI';
  pets: Pet[] = [];
  petToEdit?: Pet;

  constructor(private petsService: PetsService){}

  ngOnInit() : void {
    this.petsService.getPets().subscribe((result: Pet[]) => (this.pets = result));
  }

  updatePetList(value: boolean){
    this.petsService.getPets().subscribe((result: Pet[]) => (this.pets = result));
    this.petToEdit = undefined;
  }

  initNewPet(){
    this.petToEdit = new Pet(); 
  }

  editPet(pet: Pet){
    this.petToEdit = pet;
  }
}
