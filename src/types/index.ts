export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  userId: string;
  fullName: string;
  email: string;
  roles: string[];
  token: string;
  expiresAt: string;
}

export interface MealDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
}

export interface CreateMealDto {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  categoryId: number;
}

export interface UpdateMealDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  categoryId: number;
}

export interface CategoryDto {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  mealsCount: number;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  imageUrl: string;
}

export interface UpdateCategoryDto {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export interface CartDto {
  id: number;
  userId: string;
  items: CartItemDto[];
  totalPrice: number;
  itemsCount: number;
}

export interface CartItemDto {
  id: number;
  mealId: number;
  mealName: string;
  mealImageUrl: string;
  mealPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface AddToCartDto {
  mealId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  cartItemId: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  userId: string;
  customerName: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  shippingAddress: string;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  id: number;
  mealId: number;
  mealName: string;
  mealImageUrl: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface CreateOrderDto {
  shippingAddress: string;
}

export interface DashboardDto {
  totalCategories: number;
  totalMeals: number;
  totalCustomers: number;
  totalOrders: number;
}
