import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pet } from '../../models/pet';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PetsService } from '../../services/pets.service';

@Component({
  selector: 'app-edit-pet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './edit-pet.component.html',
  styleUrl: './edit-pet.component.css'
})
export class EditPetComponent {
  @Input() pet?: Pet;
  @Output() petsUpdated = new EventEmitter<any>();

  constructor(private petsServices: PetsService) { }

  ngOnChanges(): void{
    if(this.pet){
      this.petsServices.getPet(this.pet.id).subscribe((newPet) => {this.pet = newPet});
    }
  }
  updatePet(pet: Pet){
    this.petsServices.updatePet(pet).subscribe(() => {this.petsUpdated.emit(true)});
  }
  deletePet(pet: Pet){
    this.petsServices.deletePet(pet).subscribe(() => {this.petsUpdated.emit(true)})
  }
  createPet(pet: Pet){
    this.petsServices.createPet(pet).subscribe(() => {this.petsUpdated.emit(true)})
  }
}
