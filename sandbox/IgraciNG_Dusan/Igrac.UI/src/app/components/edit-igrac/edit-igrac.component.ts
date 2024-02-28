import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Igrac } from '../../models/igrac';
import { IgracService } from '../../services/igrac.service';

@Component({
  selector: 'app-edit-igrac',
  templateUrl: './edit-igrac.component.html',
  styleUrl: './edit-igrac.component.css'
})
export class EditIgracComponent implements OnInit{
  @Input() igrac?: Igrac;
  @Output() igraciUpdated = new EventEmitter<Igrac[]>();
  
  constructor(private igracService: IgracService) { }

  ngOnInit(): void {
  
  }

  updateIgrac(igrac:Igrac){
    this.igracService.updateIgrac(igrac).subscribe((igraci: Igrac[]) => this.igraciUpdated.emit(igraci));
  }

  deleteIgrac(igrac:Igrac){
    this.igracService.deleteIgrac(igrac).subscribe((igraci: Igrac[]) => this.igraciUpdated.emit(igraci));
  }

  createIgrac(igrac:Igrac){
    this.igracService.createIgrac(igrac).subscribe((igraci: Igrac[]) => this.igraciUpdated.emit(igraci));
  }

}
