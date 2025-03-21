// Query handling for GMA Intelligent Qualification Query System

// Sample data for demo purposes
const sampleQueries = {
  'fitness band with lithium battery': {
    eu: {
      title: "European Union Market Access Requirements (Wearable Device with Lithium Battery)",
      content: `
## Mandatory Certifications
- **CE Marking** required under multiple directives:
  - Radio Equipment Directive (RED) 2014/53/EU
  - Low Voltage Directive (LVD) 2014/35/EU 
  - Electromagnetic Compatibility (EMC) Directive 2014/30/EU
  - Restriction of Hazardous Substances (RoHS) Directive 2011/65/EU

## Battery Requirements
- **IEC 62133-2:2017**: Safety requirements for portable sealed secondary lithium cells
- **Battery Directive 2006/66/EC**: Requirements for registration, collection, and recycling
- **UN 38.3**: Transport testing for lithium batteries

## Health & Safety Testing
- **EN 50566:2017**: Product standard to demonstrate compliance with RF fields from devices used near the human body
- **Biocompatibility Testing**: For materials in direct skin contact (ISO 10993-5, ISO 10993-10)
- **REACH Regulation (EC 1907/2006)**: Registration, Evaluation, Authorization of Chemicals

## Declaration Process
1. Perform conformity assessment and testing with notified body
2. Prepare technical documentation including test reports
3. Issue Declaration of Conformity (DoC)
4. Affix CE marking to product

## Packaging & Labeling
- CE mark must be at least 5mm in height
- Battery disposal information
- WEEE symbol for electronic waste

❗ **Important Update**: Starting January 1, 2024, new requirements under Regulation (EU) 2023/648 will impose additional phthalate restrictions for wearable devices
      `
    },
    us: {
      title: "United States Market Access Requirements (Wearable Device with Lithium Battery)",
      content: `
## FCC Certification
- **FCC Part 15**: For wireless devices (Bluetooth, Wi-Fi)
  - Equipment authorization required
  - Subpart B for unintentional radiators
  - Subpart C for intentional radiators

## Battery Safety
- **UL 1642**: Standard for Lithium Batteries
- **UN 38.3**: Transport testing for lithium batteries
- **49 CFR 173.185**: DOT regulations for lithium battery shipping

## Consumer Safety
- **CPSC Compliance**: Consumer Product Safety Commission requirements
- **Biocompatibility Testing**: For materials in direct skin contact
- **California Proposition 65**: Warning requirements for chemicals

## FDA Requirements
- May require FDA registration if health claims are made
- If collecting vital signs, may be considered a medical device under 21 CFR 880.6310

## Import Requirements
- **CBP Filing**: Customs and Border Protection documentation
- **Country of Origin** marking required
- **Harmonized Tariff Schedule** (HTS) classification

❗ **Important Notice**: FCC has proposed new rules for IoT device security requirements, anticipated to be finalized by Q2 2024
      `
    }
  }
};

function handleQuery() {
  const query = document.getElementById('query-input').value.trim();
  const market = document.getElementById('market-select').value;
  const certType = document.getElementById('cert-select').value;
  
  if (!query) {
    alert('Please describe your product to generate requirements.');
    return;
  }
  
  // Show loading state
  const queryButton = document.getElementById('query-button');
  const originalText = queryButton.textContent;
  queryButton.textContent = 'Processing...';
  queryButton.disabled = true;
  
  // Simulate API call with delay
  setTimeout(() => {
    const resultsSection = document.getElementById('results-section');
    const resultsContent = document.getElementById('results-content');
    
    // Process query - in a real system, this would call the backend API
    const results = processQuery(query, market, certType);
    
    // In a production environment, you would call an actual API endpoint
    // fetch('/api/query', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ query, market, certType })
    // })
    // .then(response => response.json())
    // .then(data => {...})
    
    if (results) {
      resultsContent.innerHTML = marked.parse(results.content);
      resultsSection.classList.remove('hidden');
      
      // Scroll to results
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert('No results found for this query. Please try a different product description.');
    }
    
    // Reset button state
    queryButton.textContent = originalText;
    queryButton.disabled = false;
  }, 1500);
}

function processQuery(query, market, certType) {
  // This is a simplified mock implementation
  // In a real system, this would call the backend API
  
  // Normalize query for matching
  const normalizedQuery = query.toLowerCase();
  
  // Check if we have a matching sample query
  for (const [sampleQuery, markets] of Object.entries(sampleQueries)) {
    if (normalizedQuery.includes(sampleQuery)) {
      // If a specific market is selected, return only that market
      if (market !== 'all' && markets[market]) {
        return markets[market];
      }
      
      // If all markets are selected, return the first available market
      // In a real system, you would combine all relevant markets
      if (market === 'all') {
        const firstMarket = Object.keys(markets)[0];
        return markets[firstMarket];
      }
      
      // If the selected market is not available, return the first available market
      return markets[Object.keys(markets)[0]];
    }
  }
  
  return null;
}

/**
 * Fetches regulatory requirements from the backend API
 * @param {string} productType - Type of product (e.g., "toys")
 * @param {string} market - Target market (e.g., "Brazil")
 * @param {boolean} detailed - Whether to request detailed information
 * @returns {Promise<Object>} - Promise resolving to the requirements data
 */
async function fetchRegulationRequirements(productType, market, detailed = false) {
  try {
    // Use relative URL for API endpoint
    const apiUrl = '/api/requirements';
    
    // Prepare the request data
    const requestData = {
      product_type: productType,
      market: market,
      detailed: detailed
    };
    
    console.log('Sending request to regulation API:', requestData);
    
    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    // Parse the JSON response
    const data = await response.json();
    console.log('Received regulation data:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching regulation requirements:', error);
    throw error;
  }
}

/**
 * Display regulation requirements in the UI
 * @param {Object} data - The regulation requirements data
 */
function displayRegulationRequirements(data) {
  // Get the container for the requirements
  const requirementsContainer = document.getElementById('requirements-container');
  if (!requirementsContainer) {
    console.error('Requirements container not found');
    return;
  }
  
  // Clear previous content
  requirementsContainer.innerHTML = '';
  
  // Create header with product and market info
  const header = document.createElement('div');
  header.className = 'requirements-header';
  header.innerHTML = `<h2>Regulatory Requirements for ${data.product_type} in ${data.market}</h2>`;
  
  // Create summary section
  const summary = document.createElement('div');
  summary.className = 'requirements-summary';
  summary.innerHTML = `
    <h3>Summary</h3>
    <p>${data.summary}</p>
  `;
  
  // Add header and summary to container
  requirementsContainer.appendChild(header);
  requirementsContainer.appendChild(summary);
  
  // Create table for requirements
  const table = document.createElement('table');
  table.className = 'requirements-table';
  
  // Create table header
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>Requirement</th>
      <th>Category</th>
      <th>Description</th>
      <th>Source</th>
    </tr>
  `;
  table.appendChild(thead);
  
  // Create table body
  const tbody = document.createElement('tbody');
  
  // Add each requirement as a row
  data.requirements.forEach(req => {
    const row = document.createElement('tr');
    
    // Create source link if available
    const sourceCell = req.source 
      ? `<a href="${req.source}" target="_blank">View Source</a>` 
      : 'Not specified';
    
    row.innerHTML = `
      <td>${req.name}</td>
      <td>${req.category}</td>
      <td>${req.description}</td>
      <td>${sourceCell}</td>
    `;
    
    tbody.appendChild(row);
  });
  
  table.appendChild(tbody);
  requirementsContainer.appendChild(table);
}

/**
 * Handle form submission for regulation query
 */
function setupRegulationQueryForm() {
  const form = document.getElementById('regulation-query-form');
  if (!form) {
    console.error('Regulation query form not found');
    return;
  }
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Get form values
    const productType = document.getElementById('product-type').value;
    const market = document.getElementById('market').value;
    const detailed = document.getElementById('detailed').checked;
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Loading...';
    
    try {
      // Fetch requirements
      const data = await fetchRegulationRequirements(productType, market, detailed);
      
      // Display the results
      displayRegulationRequirements(data);
    } catch (error) {
      // Show error to user
      alert(`Error retrieving regulation requirements: ${error.message}`);
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupRegulationQueryForm();
  
  // Get the search button
  const searchButton = document.getElementById('search-requirements-btn');
  
  if (searchButton) {
    searchButton.addEventListener('click', async () => {
      // Get input values
      const productType = document.getElementById('product-type').value;
      const market = document.getElementById('market').value;
      const detailed = document.getElementById('detailed').checked;
      
      // Validate inputs
      if (!productType || !market) {
        alert('Please enter both product type and target market');
        return;
      }
      
      // Show loading state
      searchButton.textContent = 'Searching...';
      searchButton.disabled = true;
      
      try {
        // Call the API
        const data = await fetchRegulationRequirements(productType, market, detailed);
        
        // Store the data globally for later use
        currentResultData = data;
        
        // Show the results section
        document.getElementById('results-section').classList.remove('hidden');
        
        // Display the requirements in structured format by default
        displayRequirements(data);
        
        // Update data sources based on the requirements data
        updateDataSources(data);
        
        // Scroll to the results section
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        alert('Error fetching regulation requirements: ' + error.message);
      } finally {
        // Reset button state
        searchButton.textContent = 'Search Requirements';
        searchButton.disabled = false;
      }
    });
  } else {
    console.error('Search requirements button not found!');
  }
  
  // Setup format toggle buttons
  setupFormatToggleButtons();
  
  // Initialize data sources section
  updateDataSources(null);
});

// Function to set up the format toggle buttons
function setupFormatToggleButtons() {
  const structuredViewBtn = document.getElementById('structured-view-btn');
  const rawViewBtn = document.getElementById('raw-view-btn');
  const exportBtn = document.getElementById('export-btn');
  
  if (structuredViewBtn) {
    structuredViewBtn.addEventListener('click', () => {
      if (currentResultData) {
        displayRequirements(currentResultData);
      }
    });
  }
  
  if (rawViewBtn) {
    rawViewBtn.addEventListener('click', () => {
      if (currentResultData) {
        displayRawJson(currentResultData);
      }
    });
  }
  
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (currentResultData) {
        exportDataAsJson(currentResultData);
      }
    });
  }
}

// This function can be integrated with your existing UI
// You'll need to call this when your form is submitted or when a user requests requirements
async function getRegulationRequirements() {
  // Get input values from your existing UI elements
  // You'll need to adapt this to match your HTML structure
  const productType = document.getElementById('product-input').value; // Update with your actual input ID
  const market = document.getElementById('market-input').value; // Update with your actual input ID
  const detailed = document.getElementById('detailed-checkbox')?.checked || false; // Update with your actual checkbox ID
  
  try {
    // Show loading indicator if you have one
    // toggleLoadingIndicator(true);
    
    // Fetch the requirements
    const requirementsData = await fetchRegulationRequirements(productType, market, detailed);
    
    // Process the data using your existing display functions
    // This will depend on your current UI structure
    displayRequirementsInExistingUI(requirementsData);
    
    return requirementsData;
  } catch (error) {
    // Handle errors in your UI
    console.error('Failed to get requirements:', error);
    // showErrorMessage(error.message); // Implement this based on your UI
  } finally {
    // Hide loading indicator if you have one
    // toggleLoadingIndicator(false);
  }
}

// Example function to integrate with your existing UI
// You'll need to adapt this to your actual UI structure
function displayRequirementsInExistingUI(data) {
  // This is just an example - modify to work with your existing UI components
  
  // Assuming you have a container for requirements
  const container = document.getElementById('results-container'); // Update with your actual container ID
  if (!container) return;
  
  // Clear previous results
  // container.innerHTML = '';
  
  // Create content based on the requirements data
  let content = `
    <div class="requirements-section">
      <h3>Regulatory Requirements for ${data.product_type} in ${data.market}</h3>
      <p class="summary">${data.summary}</p>
      <ul class="requirements-list">
  `;
  
  // Add each requirement
  data.requirements.forEach(req => {
    const sourceLink = req.source ? 
      `<a href="${req.source}" target="_blank" class="source-link">Source</a>` : '';
    
    content += `
      <li class="requirement-item">
        <h4>${req.name} <span class="category">${req.category}</span></h4>
        <p>${req.description}</p>
        ${sourceLink}
      </li>
    `;
  });
  
  content += `
      </ul>
    </div>
  `;
  
  // Add a section for all sources at the bottom
  content += `</div>
    
    <div class="mt-8 pt-6 border-t border-gray-200">
      <h3 class="text-lg font-semibold mb-3">Reference Sources</h3>
      <ul class="list-disc pl-5 space-y-2">
  `;
  
  // Create a Set to track unique source URLs
  const uniqueSources = new Set();
  
  // Add each unique source
  data.requirements.forEach(req => {
    if (req.source && !uniqueSources.has(req.source)) {
      uniqueSources.add(req.source);
      
      // Simply use the source URL directly without any assumptions
      let displayText = req.source;
      
      // Optional: Try to make the display slightly more readable
      try {
        const url = new URL(req.source);
        // Just display the hostname and truncated path if it's long
        const path = url.pathname.length > 20 ? 
          url.pathname.substring(0, 20) + '...' : 
          url.pathname;
        displayText = url.hostname + path;
      } catch (e) {
        // If parsing fails, use the original source as-is
      }
      
      content += `
        <li class="text-sm">
          <a href="${req.source}" target="_blank" class="text-blue-600 hover:underline">
            ${displayText}
          </a>
        </li>
      `;
    }
  });
  
  content += `
      </ul>
    </div>
  `;
  
  // Add to your container
  // container.innerHTML = content;
  
  // Or use your existing rendering mechanism
  // For example, if you're using a chart or visualization library
}

// Add an event listener to trigger the API call
// You'll need to adapt this to your existing UI events
document.addEventListener('DOMContentLoaded', () => {
  // Find your existing submit button or form
  const submitButton = document.getElementById('search-button'); // Update with your actual button ID
  if (submitButton) {
    submitButton.addEventListener('click', async (e) => {
      e.preventDefault();
      await getRegulationRequirements();
    });
  }
  
  // Or if you have a form
  const form = document.getElementById('search-form'); // Update with your actual form ID
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await getRegulationRequirements();
    });
  }
});

// Store the current result data globally so we can access it for export and view toggling
let currentResultData = null;

// New function to extract data sources from requirements data without hardcoding
function extractDataSources(requirementsData) {
  const sources = new Map(); // Use a Map to avoid duplicates
  
  // Process each requirement to extract sources
  if (requirementsData && requirementsData.requirements) {
    requirementsData.requirements.forEach(req => {
      if (req.source) {
        try {
          // Parse the URL to get domain info
          const url = new URL(req.source);
          const domain = url.hostname;
          
          // Generate a unique key for this source based on full URL
          // This avoids making assumptions about what constitutes uniqueness
          const sourceKey = req.source;
          
          // If we haven't seen this source yet, add it
          if (!sources.has(sourceKey)) {
            sources.set(sourceKey, {
              name: domain, // Just use the domain as name - no assumptions
              url: req.source,
              category: req.category || "Unknown" // Use the category if available
            });
          }
        } catch (e) {
          console.warn(`Invalid URL format for source: ${req.source}`);
          
          // For non-URL sources, still add them as-is
          if (!sources.has(req.source)) {
            sources.set(req.source, {
              name: req.source,
              url: req.source,
              category: req.category || "Unknown"
            });
          }
        }
      }
    });
  }
  
  // Convert Map to array
  return Array.from(sources.values());
}

// Function to display data sources extracted from requirements
function displayDataSources(sources) {
  const container = document.getElementById('data-sources-content');
  
  if (!sources || sources.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 py-4">
        <p>No source references available for this search.</p>
      </div>
    `;
    return;
  }
  
  let content = '';
  
  // Create elements for each data source
  sources.forEach((source, index) => {
    const isLast = index === sources.length - 1;
    const borderClass = isLast ? '' : 'mb-4 pb-4 border-b border-gray-100';
    
    content += `
      <div class="${borderClass}">
        <div class="flex justify-between items-start">
          <h4 class="text-sm font-semibold">${source.category || "Reference"}</h4>
          <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">${source.category || "Reference"}</span>
        </div>
        <div class="text-xs text-gray-500 mt-1">External resource</div>
        <div class="text-sm mt-2">
          <a href="${source.url}" target="_blank" class="text-blue-600 hover:underline text-xs flex items-start break-all">
            <i data-lucide="external-link" class="h-3 w-3 mr-1 flex-shrink-0 mt-0.5"></i>
            ${source.url}
          </a>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = content;
  
  // Initialize icons
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Replace the updateDataSources function to use the extracted data
function updateDataSources(requirementsData) {
  if (!requirementsData) {
    const container = document.getElementById('data-sources-content');
    container.innerHTML = `
      <div class="text-center text-gray-500 py-4">
        <p>Search for requirements to see source references.</p>
      </div>
    `;
    return;
  }
  
  // Extract and display data sources
  const sources = extractDataSources(requirementsData);
  displayDataSources(sources);
}

// Function to display requirements in structured format
function displayRequirements(data) {
  // Get the results container
  const resultsContent = document.getElementById('results-content');
  
  // Create the content structure
  let content = `
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">Requirements for ${data.product_type} in ${data.market}</h2>
      <div class="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 class="text-md font-semibold mb-2">Summary</h3>
        <p>${data.summary}</p>
      </div>
    </div>
    
    <h3 class="text-lg font-semibold mb-3">Detailed Requirements</h3>
    <div class="space-y-4">
  `;
  
  // Add each requirement
  data.requirements.forEach(req => {
    // Format the source link
    let sourceHtml = '<p class="text-sm text-gray-500 mt-2">No source provided</p>';
    
    if (req.source) {
      // Display the entire source URL without modification
      sourceHtml = `
        <div class="mt-3">
          <p class="text-sm font-medium text-gray-700 mb-1">Source:</p>
          <a href="${req.source}" target="_blank" class="text-blue-600 hover:underline text-sm flex items-center break-all">
            <i data-lucide="external-link" class="h-3 w-3 mr-1 flex-shrink-0"></i>
            ${req.source}
          </a>
        </div>
      `;
    }
    
    content += `
      <div class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
        <div class="flex justify-between items-start">
          <h4 class="text-md font-semibold">${req.name}</h4>
          <span class="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">${req.category}</span>
        </div>
        <p class="text-sm text-gray-700 mt-2">${req.description}</p>
        ${sourceHtml}
      </div>
    `;
  });
  
  // Close the divs without adding the Reference Sources section
  content += `</div>`;
  
  // Insert the content into the results container
  resultsContent.innerHTML = content;
  
  // Set button states for view type
  setViewButtonStates('structured');
  
  // Initialize icons after DOM update
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Function to display raw JSON view
function displayRawJson(data) {
  // Get the results container
  const resultsContent = document.getElementById('results-content');
  
  // Create the header
  let content = `
    <div class="mb-4">
      <h2 class="text-xl font-bold mb-2">Requirements for ${data.product_type} in ${data.market}</h2>
      <p class="text-sm text-gray-600 mb-4">Raw JSON data format</p>
    </div>
  `;
  
  // Format the JSON with syntax highlighting (simple version)
  const jsonString = JSON.stringify(data, null, 2);
  
  content += `
    <div class="bg-gray-50 p-4 rounded-lg overflow-auto" style="max-height: 600px">
      <pre class="text-sm font-mono whitespace-pre">${escapeHtml(jsonString)}</pre>
    </div>
  `;
  
  // Insert the content into the results container
  resultsContent.innerHTML = content;
  
  // Set button states for view type
  setViewButtonStates('raw');
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Function to set button states based on current view
function setViewButtonStates(currentView) {
  const structuredBtn = document.getElementById('structured-view-btn');
  const rawBtn = document.getElementById('raw-view-btn');
  
  if (currentView === 'structured') {
    structuredBtn.classList.add('bg-black', 'text-white');
    structuredBtn.classList.remove('bg-white', 'text-gray-700');
    
    rawBtn.classList.add('bg-white', 'text-gray-700');
    rawBtn.classList.remove('bg-black', 'text-white');
  } else {
    rawBtn.classList.add('bg-black', 'text-white');
    rawBtn.classList.remove('bg-white', 'text-gray-700');
    
    structuredBtn.classList.add('bg-white', 'text-gray-700');
    structuredBtn.classList.remove('bg-black', 'text-white');
  }
}

// Function to export data as JSON file
function exportDataAsJson(data) {
  // Create a descriptive filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const product = data.product_type.replace(/\s+/g, '-').toLowerCase();
  const market = data.market.replace(/\s+/g, '-').toLowerCase();
  const filename = `regulatory-requirements_${product}_${market}_${timestamp}.json`;
  
  // Create blob from the JSON data
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  // Create download link
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = filename;
  
  // Append to document, click, and remove
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  
  // Clean up the URL object
  URL.revokeObjectURL(downloadLink.href);
}
