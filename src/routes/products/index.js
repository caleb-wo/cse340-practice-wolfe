import { Router } from 'express';
import { getAllCategories, getCategory, getCategoryItems, getRandomProduct } from '../../models/products-data.js';
 
const router = Router();
 
/**
 * The explore functionality is more complex, involving data fetching and
 * dynamic content, so it gets its own directory. This keeps the code
 * organized and makes it easier to maintain and expand.
 */
 
// Route for /products - redirects to a random category
router.get('/', async (req, res) => {
    const randomProduct = await getRandomProduct();
    res.redirect(`/products/${randomProduct.category}`);
});
 
// Route for viewing a category and its items
router.get('/:category', async (req, res) => {
    const { category } = req.params;
    const { display = 'grid' } = req.query;
 
    // Use model to get category data
    const categoryData = await getCategory(category);
 
    // Check if category exists
    if (!categoryData) {
        /**
         * If the category or item doesn't exist, create a 404 error
         * and pass it to the error handler by throwing it. This is
         * possible in Express 5+ because it automatically catches async
         * errors and passes them to your registered error handler.
         */
        const err = new Error('Category Not Found');
        err.status = 404;
        throw err;
    }
 
    // Get the items in this category
    const items = await getCategoryItems(category);
 
    // Render the products template with category and items
    res.render('products', { 
        title: `Exploring ${categoryData.name}`,
        categoryId: category,
        categoryName: categoryData.name,
        categoryDescription: categoryData.description,
        display,
        items
    });
});
 
// Redirect item routes to category page
router.get('/:category/:id', async (req, res) => {
    const { category } = req.params;
    res.redirect(`/products/${category}`);
});
 
export default router;