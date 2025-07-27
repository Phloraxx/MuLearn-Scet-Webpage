# Workshop Registration Setup Guide

This guide will help you set up the workshop registration page with Google OAuth and WordPress WooCommerce integration.

## Prerequisites

1. Google OAuth 2.0 Client ID
2. WordPress site with WooCommerce plugin
3. WooCommerce REST API credentials

## Setup Instructions

### 1. Google OAuth Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add your domain to authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `https://yourdomain.com` (for production)
6. Copy the Client ID

### 2. WordPress WooCommerce Setup

1. Install and activate WooCommerce plugin on your WordPress site
2. Go to WooCommerce > Settings > Advanced > REST API
3. Create a new API key with Read/Write permissions
4. Copy the Consumer Key and Consumer Secret

### 3. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your credentials:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_WOOCOMMERCE_API_URL=https://pay.mulearnscet.in/wp-json/wc/v3
   VITE_WOOCOMMERCE_CONSUMER_KEY=your_consumer_key_here
   VITE_WOOCOMMERCE_CONSUMER_SECRET=your_consumer_secret_here
   ```

### 4. WordPress Product Setup

1. Create a product in WooCommerce for your workshop:
   - Go to Products > Add New
   - Set the product name, price, and description
   - Note the Product ID (visible in the URL when editing)
   - Update the `product_id` in the registration component

### 5. Payment Gateway Integration

The current implementation includes a basic structure for payment processing. To integrate with a real payment gateway:

#### For Razorpay:
1. Install Razorpay WooCommerce plugin
2. Configure Razorpay settings in WooCommerce
3. Update the payment flow in `RegistrationPage.jsx`

#### For Stripe:
1. Install Stripe WooCommerce plugin
2. Configure Stripe settings in WooCommerce
3. Update the payment flow accordingly

### 6. Security Considerations

1. **CORS**: Ensure your WordPress site allows requests from your domain
2. **API Keys**: Keep your WooCommerce API keys secure
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for API requests

### 7. Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/register` route
3. Test the complete flow:
   - Google OAuth login
   - Form submission
   - Payment process (in test mode)

### 8. WordPress WooCommerce API Endpoints Used

- `POST /wp-json/wc/v3/orders` - Create new order
- `PUT /wp-json/wc/v3/orders/{id}` - Update order status
- `GET /wp-json/wc/v3/orders/{id}` - Get order details
- `GET /wp-json/wc/v3/products` - Get products list

### 9. Customization

#### Workshop Details
Update the `workshopDetails` object in `RegistrationPage.jsx`:
```javascript
const workshopDetails = {
  title: "Your Workshop Name",
  price: 199,
  currency: "INR",
  duration: "2 Days",
  date: "Your Date",
  venue: "Your Venue"
}
```

#### Form Fields
Modify the registration form fields in the component as needed.

#### Styling
The component uses Tailwind CSS. Customize colors and styles as needed.

### 10. Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to your hosting platform
3. Update Google OAuth authorized origins with your production domain
4. Update environment variables for production

### 11. Troubleshooting

#### Common Issues:

1. **Google OAuth Error**: Check if your domain is added to authorized origins
2. **API Connection Error**: Verify WooCommerce API credentials and CORS settings
3. **Payment Gateway Error**: Check payment gateway configuration in WooCommerce

#### Debug Mode:
Enable debug mode by adding console logs to track API responses and errors.

### 12. Support

If you need additional customization or face issues:
1. Check WordPress and WooCommerce documentation
2. Verify all API credentials
3. Test API endpoints using tools like Postman
4. Check browser console for JavaScript errors

## File Structure

```
src/
├── components/
│   ├── RegistrationPage.jsx       # Main registration component
│   ├── GoogleAuthProvider.jsx     # Google OAuth provider
│   └── Navigation.jsx             # Updated navigation with registration link
├── utils/
│   └── woocommerceApi.js          # WooCommerce API utilities
└── App.jsx                        # Updated with routing
```

## Next Steps

1. Set up your environment variables
2. Test the registration flow
3. Integrate with your preferred payment gateway
4. Customize the UI/UX as needed
5. Add email notifications (optional)
6. Set up analytics tracking (optional)
