// import { Component, OnInit } from '@angular/core';
// import { ProductServicesService } from '../../services/product-services.service';
// import { IProducts } from '../../models/i-products';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-products',
//   standalone: true,
//   imports: [RouterModule, CommonModule, FormsModule],
//   templateUrl: './admin-products.component.html',
//   styleUrl: './admin-products.component.css'
// })
// export class AdminProductsComponent implements OnInit {
//   products: IProducts[] = [];

//   // Modal state
//   showModal: boolean = false;
//   currentFlavor: string = '';
//   currentProductId: number = 0;
//   currentQuantity: number = 0;

//   constructor(private productService: ProductServicesService) {}

//   ngOnInit() {
//     this.loadProducts();
//   }

//   loadProducts() {
//     this.productService.getAllProducts().subscribe(products => {
//       this.products = products;
//     });
//   }

//   deleteProduct(id: string) {
//     this.productService.deleteProduct(id).subscribe(() => {
//       this.loadProducts();
//     });
//   }

//   getFlavors(product: IProducts): string[] {
//     return Object.keys(product.product_images || {});
//   }

//   editFlavor(productId: number, flavor: string) {
//     const product = this.products.find(p => p.id === productId);
//     if (product) {
//       this.currentProductId = productId;
//       this.currentFlavor = flavor;
//       this.currentQuantity = product.flavor_quantity[flavor];
//       this.showModal = true;
//     }
//   }

//   async deleteFlavor(productId: string, flavorName: string) {
//     try {
//       // Show confirmation dialog
//       const confirmed = confirm(`Are you sure you want to delete ${flavorName} flavor from this product?`);
      
//       if (!confirmed) {
//         return; // User cancelled
//       }
      
//       // Proceed with deletion
//       const result = await this.productService.deleteFlavorFromProduct(productId, flavorName);
      
//       // Show success message
//       console.log(result.message);
//       // Optionally refresh the product data
//       await this.loadProducts();
      
//     } catch (error) {
//       console.error('Error deleting flavor:', error);
//       // Handle error (show error message to user)
//     }
//   }
  
//   async saveFlavorQuantity() {
//     await this.productService.updateFlavorQuantityAdmin(
//       this.currentProductId.toString(),
//       this.currentFlavor,
//       this.currentQuantity
//     );
//     this.showModal = false;
//     this.loadProducts();
//   }
  

//   closeModal() {
//     this.showModal = false;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ProductServicesService } from '../../services/product-services.service';
import { IProducts } from '../../models/i-products';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
        padding: '0 0',
        margin: '0 0'
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
        overflow: 'visible'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class AdminProductsComponent implements OnInit {
  products: IProducts[] = [];

  // Flavor edit modal state
  showFlavorModal = false;
  currentFlavor = '';
  currentProductId = 0;
  currentQuantity = 0;

  // Product edit modal state
  showProductModal = false;
  editingProduct: IProducts | null = null;
  newFlavorName = '';
  newFlavorQuantity: number | null = null;
  newFlavorImage = '';

  constructor(
    private productService: ProductServicesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = products;
    });
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  getFlavors(product: IProducts): string[] {
    return Object.keys(product.product_images || {});
  }

  editFlavor(productId: number, flavor: string) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.currentProductId = productId;
      this.currentFlavor = flavor;
      this.currentQuantity = product.flavor_quantity[flavor];
      this.showFlavorModal = true;
    }
  }

  async deleteFlavor(productId: string, flavorName: string) {
    const confirmed = confirm(`You are about to delete this item forever.\nThis action cannot be undone.`);
    if (!confirmed) return;

    try {
      await this.productService.deleteFlavorFromProduct(productId, flavorName);
      this.loadProducts();
    } catch (error) {
      console.error('Error deleting flavor:', error);
    }
  }

  async saveFlavorQuantity() {
    await this.productService.updateFlavorQuantityAdmin(
      this.currentProductId.toString(),
      this.currentFlavor,
      this.currentQuantity
    );
    this.showFlavorModal = false;
    this.loadProducts();
  }

  closeFlavorModal() {
    this.showFlavorModal = false;
  }

  openEditProductModal(product: IProducts) {
    this.editingProduct = { ...product };
    this.showProductModal = true;
    this.newFlavorName = '';
    this.newFlavorQuantity = null;
    this.newFlavorImage = '';
  }

  closeProductModal() {
    this.showProductModal = false;
    this.editingProduct = null;
  }

  async saveProductChanges() {
    if (!this.editingProduct) return;

    await this.productService.updateProduct(this.editingProduct.id.toString(), this.editingProduct);
    this.closeProductModal();
    this.loadProducts();
  }

  async addFlavorToProduct() {
    if (
      this.editingProduct &&
      this.newFlavorName &&
      this.newFlavorQuantity !== null &&
      this.newFlavorImage
    ) {
      const { newFlavorName, newFlavorQuantity, newFlavorImage } = this;

      this.editingProduct.flavor_quantity[newFlavorName] = newFlavorQuantity;
      this.editingProduct.product_images[newFlavorName] = newFlavorImage;
      if (!this.editingProduct.available_flavors.includes(newFlavorName)) {
        this.editingProduct.available_flavors.push(newFlavorName);
      }

      this.newFlavorName = '';
      this.newFlavorQuantity = null;
      this.newFlavorImage = '';
    }
  }

  async deleteProduct(productId: string) {
    const confirmed = confirm(`You are about to delete this item forever.\nThis action cannot be undone.`);
    if (!confirmed) return;

    await this.productService.deleteProduct(productId);
    this.loadProducts();
  }
  expandedIndexes: { [key: number]: boolean } = {};

toggleProduct(index: number): void {
  this.expandedIndexes[index] = !this.expandedIndexes[index];
}
}
