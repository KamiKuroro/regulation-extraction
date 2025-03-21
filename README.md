# regulation-extraction

## Backend (Python)

The backend is built in Python and handles the extraction and processing of regulatory information from the internet.

### Setup

1. Ensure Python 3.7+ is installed
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure settings in `config.yaml` as needed
   - You'll need to supply an OpenAI API key in this configuration file

### Running the Application

```bash
python3 run.py
```

This will start the server and the web interface will be available at the root path `/`.

The API documentation is available at `/docs`.

## Frontend (Web)

The frontend provides a user interface for querying and visualizing the extracted regulatory information.

### Features

- Interactive query interface for searching regulations
- Visualization tools for regulatory data
- Responsive design for desktop and mobile devices

## Development

### Adding New Features

1. For backend changes, update the appropriate Python modules in the `app` directory
2. For frontend changes, modify the HTML, CSS, and JavaScript files in the `web` directory
3. Test changes locally before deployment

### API Documentation

The backend exposes several API endpoints for querying and retrieving regulatory data. Refer to the application documentation for detailed API usage.

## License

This project is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.en.html).
