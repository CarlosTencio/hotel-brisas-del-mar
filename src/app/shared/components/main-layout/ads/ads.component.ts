import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { AdMain } from '../../../../models/ad-main.interface';
import { AdService } from '../../../../core/services/ad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ads',
  imports: [CommonModule],
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.css'
})
export class AdsComponent implements OnInit {

  adService= inject(AdService);

  private ads: AdMain[] = [];
  adDisplay?: AdMain;
  private adItem: number = 0;
  private adInterval: number = 8000;


  ngOnInit() {
    this.getAds();
  }

  async getAds() {

    this.adService.getAds().subscribe({

      next: (response) => {

        this.ads = response;

        this.transitionAd();

      },

      error: (error) => {

        console.log("Error en la consulta de anuncios", error);

      }


    });

  }

  changeAd() {

    this.adItem++;

    if (this.adItem >= this.ads.length) {

      this.adItem = 0;

    }

    this.adDisplay = this.ads[this.adItem];

  }

  transitionAd() {

    //not need to execute the transition if there are no ads
    if (this.ads.length <= 0) {

      return;

    }

    //if there is only one ad, display it
    if (this.ads.length === 1) {

      this.adDisplay = this.ads[0];

      return;
    }

    //show the first ad and next wait for the interval to change it
    this.adDisplay = this.ads[this.adItem];

    //set a time to change the ad every 5 seconds
    setInterval(() => {

      this.changeAd();

    }, this.adInterval);

  };


}
