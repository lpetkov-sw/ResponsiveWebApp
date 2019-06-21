import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import * as hexRgb from 'hex-rgb';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-responsive-grid',
  templateUrl: './responsive-grid.component.html',
  styleUrls: ['./responsive-grid.component.sass']
})
export class ResponsiveGridComponent implements OnInit {
  
  readonly IMAGES_PER_PAGE = 30;
  
  // Array for storing all the data inside
  imagesData: Array<any> = [];
  // Array with data using for displaying data in the template
  pageData: Array<any> = [];

  currentPage: number = 0;
  isMobile: boolean;

  constructor(
    private _dataService : DataService,
    private deviceService: DeviceDetectorService
  ) {
    // Check if the device is mobile with "ngx-device-detector"
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit() {
    
    this._dataService.loadData().subscribe(data => {
      // load the data in array
      this.imagesData = (Object.values(data)) ;
      // Sort images by red color value
      this.sortImagesData();
      // load the first page with data
      this.loadNextPage();
    });
  }

  private getRedColorFromUrl(url) {
    // get the hex color from the url of image
    let hexColor = url.split('/').pop();
    
    // Some of the provided color hex codes are not valid, because contains only 5 characters.
    // In that case we return 255 as a Red value for it's red color.
    // (255 is the highest value of red in RGB)
    try {
      return hexRgb(hexColor).red;
    }
    catch(e) {
      // Hex color code is not valid.
      // 255 is returned in order to be placed in last positions.
      return 255;
    }
  }

  private sortImagesData() {
    this.imagesData.sort((item1, item2) => {
      return( this.getRedColorFromUrl(item1.url) > this.getRedColorFromUrl(item2.url) ) ? 1 : -1;
    });
  }

  private getNextPageData() {
    let startIndex = this.currentPage*this.IMAGES_PER_PAGE;
    let endIndex = startIndex + this.IMAGES_PER_PAGE;

    return this.imagesData.slice(startIndex, endIndex);
  }

  private loadNextPage() {
    this.pageData = this.pageData.concat(this.getNextPageData());
    this.currentPage++;
  }

  private removeColorImage(index) {
    // Delete the required index only from the array which is displayed
    // in order to be sure that the pagination will still work in appropriate way
    this.pageData.splice(index, 1);
  }

}
