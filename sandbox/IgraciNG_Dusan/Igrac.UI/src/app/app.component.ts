import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Igrac } from './models/igrac';
import { IgracService } from './services/igrac.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Igrac.UI';
  igraci: Igrac[] = [];
  igracToEdit?: Igrac;

  constructor(private igracService: IgracService) {}

  ngOnInit() : void {
    this.igracService.getIgraci().subscribe((result: Igrac[]) => (this.igraci = result));
  }

  updateIgracList(igraci: Igrac[]){
    this.igraci = igraci;
  }

  initNewIgrac(){
    this.igracToEdit = new Igrac();
  }

  editIgrac(igrac: Igrac){
    this.igracToEdit = igrac;
  }
}
