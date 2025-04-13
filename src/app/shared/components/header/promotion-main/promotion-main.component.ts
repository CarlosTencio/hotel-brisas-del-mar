import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PromotionMain } from '../../../../models/promotion-main.interface';
import { PromotionService } from '../../../../core/services/promotion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion-main',
  imports: [CommonModule],
  templateUrl: './promotion-main.component.html',
  styleUrl: './promotion-main.component.css'
})
export class PromotionMainComponent implements OnInit {

  private promotions: PromotionMain[] = [];
  promotionDisplay?: PromotionMain;
  private promotionItem: number = 0;
  private promotionInterval: number = 7000;

  constructor(private promotionService: PromotionService) { }

  ngOnInit() {
    this.getPromotions();
  }

  async getPromotions() {

    this.promotionService.getPromotions().subscribe({

      next: (response) => {

        this.promotions = response;

        this.transitionAd();

      },

      error: (error) => {

        console.log("Error en la consulta de anuncios", error);

      }


    });

  }

  changeAd() {

    this.promotionItem++;

    if (this.promotionItem >= this.promotions.length) {

      this.promotionItem = 0;

    }

    this.promotionDisplay = this.promotions[this.promotionItem];

  }

  transitionAd() {

    //not need to execute the transition if there are no ads
    if (this.promotions.length <= 0) {

      return;

    }

    //if there is only one ad, display it
    if (this.promotions.length === 1) {

      this.promotionDisplay = this.promotions[0];

      return;
    }

    //show the first ad and next wait for the interval to change it
    this.promotionDisplay = this.promotions[this.promotionItem];

    //set a time to change the ad every 5 seconds
    setInterval(() => {

      this.changeAd();

    }, this.promotionInterval);

  };


}
