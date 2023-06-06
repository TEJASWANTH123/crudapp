const express = require('express');
const fs = require('fs');

const app = express();

app.get('/api/products/list', (req, res) => {
    const pageSize = parseInt(req.query.size);
    const pageOffset = parseInt(req.query.page);

    fs.readFile('item_list.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);

            // Perform pagination calculations
            const startIndex = pageOffset * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedData = jsonData.slice(startIndex, endIndex);

            // Extract the required fields from each item in the paginated data
            const responseArray = paginatedData.map(product => {
                const {
                    id,
                    item_name,
                    item_image,
                    item_price
                } = product;

                return {
                    id,
                    item_name,
                    item_image,
                    item_price
                };
            });

            res.json(responseArray);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
});

app.get('/api/products/:id', (req, res) => {
    // Read the JSON file
    const productId = parseInt(req.params.id);

    fs.readFile('item_list.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        try {
            const jsonData = JSON.parse(data);

            // Find the product with the matching id
            const product = jsonData.find(product => product.id === productId);

            if (!product) {
                res.status(404).send('Product Not Found');
                return;
            }

            // Extract the required fields from the product
            const {
                id,
                item_name,
                item_image,
                import_date,
                expiration_date,
                item_price,
                item_quantity,
                item_weight,
                item_tax,
                item_availability
            } = product;

            // Create the response object with the desired fields
            const responseObject = {
                id,
                item_name,
                item_image,
                import_date,
                expiration_date,
                item_price,
                item_quantity,
                item_weight,
                item_tax,
                item_availability
            };

            res.json(responseObject);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
