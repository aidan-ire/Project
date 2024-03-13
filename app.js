const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000; // Define port number, default is 3000

// Serve static files (like HTML, CSS, images)
app.use(express.static('public'));
app.set('view engine', 'ejs'); // Set the view engine to EJS for rendering dynamic content
app.use(express.static('views')); // Serve static files from the views directory
app.use(express.static('styles')); // Serve static files from the style directory

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Handle form submission
app.post('/submit_phone', (req, res) => {
    const newPhone = req.body;

    // Load existing phones from JSON file
    let phones = [];
    try {
        const data = fs.readFileSync('addPhone.json');
        phones = JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }

    // Add new phone to the array
    phones.push(newPhone);

    // Write updated array back to JSON file
    fs.writeFile('addPhone.json', JSON.stringify(phones), (error) => {
        if (error) {
            console.error('Error writing JSON file:', error);
            res.sendStatus(500);
        } else {
            console.log('Phone added successfully.');
            res.redirect('/');
        }
    });
});

app.get('/', (req, res) => {
    // Read phone data from JSON file
    fs.readFile('addPhone.json', (error, data) => {
        if (error) {
            console.error('Error reading JSON file:', error);
            res.sendStatus(500);
            return;
        }

        const phones = JSON.parse(data);
        res.render('allPhones', { phones });
    });
});

// Serve HTML file with form
app.get('/addPhone', (req, res) => {
    res.render('addPhone.ejs'); // Render the home page using the home.ejs template
});

app.get('/individual/:name', function(req, res) {
    function showIndividual(oneItem) {
        return oneItem.model === req.params.name;
    }

    // Load product data from JSON file
    const info = require('./addPhone.json');
    const ourProduct = info.filter(showIndividual);
    res.render("individual.ejs", { ourProduct });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});