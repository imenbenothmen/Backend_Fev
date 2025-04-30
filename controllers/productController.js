const productModel = require('../models/productSchema');  
const categoryModel = require('../models/categorySchema');

// Add a product with an image 
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, material, type } = req.body;
        const image = req.file ? req.file.filename : null;
        const product = new productModel({
            name,
            description,
            price,
            stock,
            image, //  fichier stocké localement
            category,
            material,
            type
    
        });

        await product.save();
        res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error while adding product", error });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error while deleting product", error });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find().populate('category');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching products", error });
    }
};

// Get product details
exports.getProductDetails = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error while fetching product details", error });
    }
};

// Get number of products by category
exports.getProductCountByCategory = async (req, res) => {
    try {
        const productCount = await productModel.countDocuments({ category: req.params.categoryId });
        res.status(200).json({ productCount });
    } catch (error) {
        res.status(500).json({ message: "Error while counting products", error });
    }
};

// Get product name
exports.getProductName = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ name: product.name });
    } catch (error) {
        res.status(500).json({ message: "Error while fetching product name", error });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, image, category, material, type, weight } = req.body;
        const product = await productModel.findByIdAndUpdate(req.params.id, {
            name, description, price, stock, image, category, material, type
        }, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error while updating product", error });
    }
};
