import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDescriptionGeneratorComponent } from './product-description-generator.component';

const routes: Routes = [
  { path: '', component: ProductDescriptionGeneratorComponent }
];

@NgModule({
  declarations: [
    ProductDescriptionGeneratorComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ProductDescriptionGeneratorModule { }
