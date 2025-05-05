import Swal from 'sweetalert2';
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
  styleUrls: ['./admin-products.component.css'],
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
  newProduct: IProducts = {

    id: 0,
    name: '',
    image: '',
    description: '',
    expiration_date: '',
    price: 0,
    brand: '',
    available_flavors: [],
    available_size: '',
    product_images: {},
    category: '',
    quantity: 0,
    inStock: true,
    flavor_quantity: {}
  };
  // Flavor edit modal state
  showFlavorModal = false;
  currentFlavor = '';
  currentProductId = 0;
  currentQuantity = 0;
  showAddProductForm: boolean = false;
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

  // loadProducts() {
  //   this.productService.getAllProducts().subscribe(products => {
  //     this.products = products;
  //   });
  // }

  toggleAddProductForm() {
    this.showAddProductForm = !this.showAddProductForm;  // Toggle form visibility
  }

 addNewProduct() {
    Swal.fire({
      title: 'Add New Product',
      html: `
        <form id="productForm" style="font-size: 0.875rem;">
          <label for="name" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Product Name:</label>
          <input type="text" id="name" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" required />
          
          <label for="description" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Description:</label>
          <textarea id="description" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem; height: 80px;" required></textarea>

          <label for="price" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Price:</label>
          <input type="number" id="price" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" required />

          <label for="image" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Image URL:</label>
          <input type="text" id="image" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" required />

          <label for="category" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Category:</label>
          <input type="text" id="category" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" required />

          <label for="available_size" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Available Size:</label>
          <input type="text" id="available_size" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" required />

          <label for="quantity" style="font-size: 0.875rem; margin-bottom: 0.25rem; display: block;">Quantity:</label>
          <input type="number" id="quantity" class="swal2-input" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" required />

          <label style="font-size: 0.875rem; margin-top: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <input type="checkbox" id="inStock" class="swal2-input" />
            In Stock
          </label>
        </form>
      `,
      customClass: {
        confirmButton: 'swal2-btn-sm',
        cancelButton: 'swal2-btn-sm',
        popup: 'swal2-popup-sm'
      },
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const description = (document.getElementById('description') as HTMLTextAreaElement).value;
        const price = parseFloat((document.getElementById('price') as HTMLInputElement).value);
        const image = (document.getElementById('image') as HTMLInputElement).value;
        const category = (document.getElementById('category') as HTMLInputElement).value;
        const availableSize = (document.getElementById('available_size') as HTMLInputElement).value;
        const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
        const inStock = (document.getElementById('inStock') as HTMLInputElement).checked;

        if (!name || !description || !price || !image || !category || !availableSize || !quantity) {
          Swal.showValidationMessage('All fields are required');
          return;
        }

        this.newProduct = {
          ...this.newProduct,
          name,
          description,
          price,
          image,
          category,
          available_size: availableSize,
          quantity,
          inStock
        };
        
        // Proceed to add the product
        return this.productService.createProduct(this.newProduct).toPromise();
      },
      showCancelButton: true,
      confirmButtonText: 'Add Product',
      cancelButtonText: 'Cancel',
      focusCancel: true
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Product Added',
          text: `Product ${this.newProduct.name} has been successfully added!`,
          timer: 2000,
          showConfirmButton: false
        });
        this.loadProducts();  // Reload the products list
      }
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Add Product',
        text: 'There was an issue adding the product. Please try again.'
      });
    });
  }

  navigateToProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  getFlavors(product: IProducts): string[] {
    // Return only flavors that have a quantity greater than 0
    return Object.keys(product.flavor_quantity).filter(flavor => product.flavor_quantity[flavor] > 0);
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this flavor forever. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await this.productService.deleteFlavorFromProduct(productId, flavorName);

      // ✅ Remove flavor from local product object
      const product = this.products.find(p => p.id.toString() === productId);
      if (product) {
        delete product.flavor_quantity[flavorName];
        delete product.product_images[flavorName];
        product.available_flavors = product.available_flavors.filter(f => f !== flavorName);
      }

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `Flavor "${flavorName}" has been removed.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting flavor:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete the flavor. Please try again later.'
      });
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

// Updated addFlavorToProduct method using the new service method

async addFlavorToProduct() {
  if (
    this.editingProduct &&
    this.newFlavorName &&
    this.newFlavorQuantity !== null &&
    this.newFlavorImage
  ) {
    const productId = this.editingProduct.id.toString();
    const { newFlavorName, newFlavorQuantity, newFlavorImage } = this;
    
    try {
      // Use the new dedicated service method to add the flavor
      await this.productService.addFlavorToProduct(
        productId,
        newFlavorName,
        newFlavorQuantity,
        newFlavorImage
      );
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Flavor Added',
        text: `"${newFlavorName}" flavor has been added to the product.`,
        timer: 2000,
        showConfirmButton: false
      });
      
      // Reset input fields
      this.newFlavorName = '';
      this.newFlavorQuantity = null;
      this.newFlavorImage = '';
      
      // Reload products to get fresh data
      await new Promise<void>((resolve) => {
        this.productService.getAllProducts().subscribe(products => {
          this.products = products;
          resolve();
        });
      });
      
      // Update the editing product with fresh data
      const updatedProduct = this.products.find(p => p.id.toString() === productId);
      if (updatedProduct) {
        this.editingProduct = { ...updatedProduct };
      }
    } catch (error) {
      console.error('Error adding flavor:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add the flavor. Please try again.'
      });
    }
  } else {
    // Show validation error if fields are missing
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Information',
      text: 'Please provide flavor name, quantity, and image URL.'
    });
  }
}
// 2. Next, improve the saveProductChanges() method to handle errors better

async saveProductChanges() {
  if (!this.editingProduct) return;
  
  try {
    await this.productService.updateProduct(
      this.editingProduct.id.toString(), 
      this.editingProduct
    );
    
    Swal.fire({
      icon: 'success',
      title: 'Changes Saved',
      text: 'Product changes have been saved successfully.',
      timer: 2000,
      showConfirmButton: false
    });
    
    this.closeProductModal();
    this.loadProducts();
  } catch (error) {
    console.error('Error saving product changes:', error);
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to save product changes. Please try again.'
    });
  }
}

// 3. Make sure loadProducts() method is properly handling async/await

loadProducts() {
  this.productService.getAllProducts().subscribe(
    products => {
      this.products = products;
      console.log('Products loaded:', this.products);
    },
    error => {
      console.error('Error loading products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load products. Please try again.'
      });
    }
  );
}

  async deleteProduct(productId: string) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this product forever. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      await this.productService.deleteProduct(productId);

      // ✅ Remove the product from the local array immediately
      this.products = this.products.filter(product => product.id.toString() !== productId);

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The product has been successfully deleted.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete the product. Please try again later.'
      });
    }
  }
}
