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

// Serve HTML file with form
app.get('/', (req, res) => {
    res.render('addPhone'); // Render the home page using the home.ejs template
});

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

app.get('/allPhones', (req, res) => {
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});