import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
// import * as cv from '../../../node_modules/@techstark/opencv-js';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare var cv: any;

@Component({
  selector: 'app-comic-panel',
  templateUrl: './comic-panel.component.html',
  styleUrls: ['./comic-panel.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('0.5s ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ComicPanelComponent implements OnInit {
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.onBackArrowClick();
    } else if (event.key === 'ArrowRight') {
      this.onNextArrowClick();
    }
  }
  
  @ViewChild('canvas', { static: true }) canvas!: ElementRef;
  @ViewChild('canvasOutput', { static: true }) canvasOutput!: ElementRef;
  context!: CanvasRenderingContext2D;
  currentPanelIndex = 0; // Track the index of the current panel
  panels:any;
  imagePath = 'assets/comic_page3.jpg';
  croppedImages: any = [];
  constructor() { }

  ngOnInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.detectPanels();
    // this.extractPanels();
  }

  detectPanels() {
    let img = new Image();
    img.src = this.imagePath; // Provide the path to your comic book page image
    img.onload = () => {
      this.context.drawImage(img, 0, 0);
      let mat = cv.imread(img);
      cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
      cv.Canny(mat, mat, 50, 150, 3, false);
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(mat, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      this.panels = [];
      // for (let i = 0; i < contours.size(); ++i) {
      //   let contour = contours.get(i);
      //   let area = cv.contourArea(contour);
      //   let perimeter = cv.arcLength(contour, true);
      //   let approx = new cv.Mat();
      //   cv.approxPolyDP(contour, approx, 0.02 * perimeter, true);
      //   if (area > 1000 && area < 50000 ) {
      //     this.panels.push(approx);
      //       approx.delete();
      //    }
      // }

      for (let i = 0; i < contours.size(); ++i) {
        const contour = contours.get(i);
        const boundingRect = cv.boundingRect(contour);
               if(boundingRect.width>200 && boundingRect.height > 200){
          this.panels.push({ x: boundingRect.x, y: boundingRect.y, width: boundingRect.width, height: boundingRect.height });

        }
      }
      
      this.panels = this.panels.sort((a:any,b:any)=>{

        if(a.y !== b.y + 5 || a.y !== b.y - 5 || a.y !== b.y){
          return a.y - b.y;
        }

        return a.x - b.x;
    })

      let color = new cv.Scalar(255, 0, 0, 255);
      console.log(this.panels);
      for (let i = 0; i < this.panels.length; ++i) {
        cv.drawContours(mat, contours, i, color, 2, cv.LINE_8, hierarchy, 0);
      }
      cv.imshow(this.canvas.nativeElement, mat);
      mat.delete();
    this.displayCurrentPanel()
    this.cropImage()

    }
  }


  // Assume you have a variable named 'panels' which contains the contours of detected panels


// Function to display the current panel
displayCurrentPanel() {
  const panel = this.panels[this.currentPanelIndex];
  const x = panel.x; // X-coordinate of the panel's top-left corner
  const y = panel.y; // Y-coordinate of the panel's top-left corner
  const width = panel.width; // Width of the panel
  const height = panel.height; // Height of the panel
  let img = new Image();
  img.src = this.imagePath; // Provide the path to your comic book page image
  img.onload = () => {
    this.context.drawImage(img, 0, 0);
    let imgMat = cv.imread(img);


  // Create a region of interest (ROI) based on the panel coordinates
  const panelROI = imgMat.roi(new cv.Rect(x, y, width, height));


  // Draw the image
  cv.imshow(this.canvasOutput.nativeElement, panelROI);


  panelROI.delete();
  imgMat.delete();

}
}

// Event handler for next arrow click
 onNextArrowClick() {
  
    if (this.currentPanelIndex < this.panels.length - 1) {
        this.currentPanelIndex++;
        this.displayCurrentPanel();
    }
}

// Event handler for back arrow click
onBackArrowClick() {
    if (this.currentPanelIndex > 0) {
        this.currentPanelIndex--;
        this.displayCurrentPanel();
    }
}


extractPanels(): void {
  const imgElement = document.getElementById('comicImage');
  const src = cv.imread(imgElement);

  // Perform image processing and panel extraction using OpenCV.js

  // Example: Detect contours
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(gray, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

  // Process contours to extract panel ROIs
  for (let i = 0; i < contours.size(); ++i) {
    const contour = contours.get(i);
    const boundingRect = cv.boundingRect(contour);
    // Extract ROI using boundingRect
    // Push the extracted panel ROI to the panels array
    this.panels.push({ x: boundingRect.x, y: boundingRect.y, width: boundingRect.width, height: boundingRect.height });
  }

  // Release memory
  gray.delete();
  src.delete();
  contours.delete();
  hierarchy.delete();
}

cropImage() {
  const image = new Image();
  image.src = this.imagePath;

  image.onload = () => {
    this.panels.forEach((panel:any) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = panel.width;
      canvas.height = panel.height;
      ctx?.drawImage(image, panel.x, panel.y, panel.width, panel.height, 0, 0, panel.width, panel.height);
      this.croppedImages.push(canvas.toDataURL()); // Store cropped image as base64
    });
  };
}

}

