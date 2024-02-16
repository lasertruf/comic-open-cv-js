import { Component } from '@angular/core';

@Component({
  selector: 'app-explosion',
  templateUrl: './explosion.component.html',
  styleUrls: ['./explosion.component.scss']
})
export class ExplosionComponent {
  objects: { x: number, y: number, exploded: boolean }[] = [];

  explodeObject(index: number): void {
    this.objects[index].exploded = true;
    setTimeout(() => {
    this.objects.splice(index,1)
      
    }, 900);
  }

  createObject(event: MouseEvent): void {
    const newObject = {
      x: event.clientX,
      y: event.clientY,
      exploded: false
    };

    let deleteObj = false;
    this.objects.forEach((el)=>{
      if(el.x == event.clientX && el.x == event.clientY ){
          deleteObj = true;
      }
    })
    if(!deleteObj)
    this.objects.push(newObject);
  }
}
