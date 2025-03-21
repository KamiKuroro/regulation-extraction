"""
Main application module for the Regulation Requirements Finder API.
"""

import os
import logging
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from openai import OpenAI, OpenAIError

from app.models import MarketRequirementsRequest, MarketRequirementsResponse
from app.config import load_config
from app.utils import parse_regulation_data

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Regulation Requirements Finder",
    description="API to search for product regulatory requirements for specific markets",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the path to the web directory relative to the backend
WEB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "web")

# Mount the static files directory
app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

# Initialize OpenAI client
def get_openai_client(config=Depends(load_config)):
    client = OpenAI(api_key=config.openai_api_key)
    return client, config


# Root route to serve the HTML file
@app.get("/")
async def root():
    return FileResponse(os.path.join(WEB_DIR, "index.html"))


@app.post("/api/requirements", response_model=MarketRequirementsResponse)
async def get_market_requirements(
    request: MarketRequirementsRequest, openai_data=Depends(get_openai_client)
):
    """
    Get regulatory requirements for a product in a specific market.

    Args:
        request: The market requirements request containing product type and market
        openai_data: Tuple containing OpenAI client and configuration

    Returns:
        MarketRequirementsResponse: Structured response with requirements and summary
    """
    client, config = openai_data

    # Create prompt for OpenAI
    detail_level = "detailed and comprehensive" if request.detailed else "concise"

    logger.info(
        f"Processing requirements request for {request.product_type} in {request.market} market"
    )

    prompt = f"""
    Please provide a {detail_level} list of all regulatory requirements, certifications, and standards that a {request.product_type} 
    must meet to legally enter and be sold in the {request.market} market.
    
    Include:
    1. Required certifications and their descriptions
    2. Safety standards that must be met
    3. Labeling requirements
    4. Testing requirements
    5. Import regulations
    6. Any other relevant compliance requirements
    
    Format the response as a JSON object with the following structure:
    {{
        "requirements": [
            {{
                "name": "Requirement/certification name",
                "description": "Detailed description",
                "category": "Category (e.g., Safety, Labeling, Testing)",
                "source": "Source of information (if available)"
            }}
        ],
        "summary": "Brief summary of key requirements"
    }}
    """

    try:
        # Call OpenAI API
        logger.info(f"Calling OpenAI API with model: {config.model}")

        # Use the correct format for web search according to API docs
        response = client.chat.completions.create(
            model=config.model,
            web_search_options={},
            messages=[{"role": "user", "content": prompt}],
        )

        # Log API call success
        logger.info("API call successful")

        # Get content from the response
        response_content = response.choices[0].message.content

        # Parse and validate the response
        success, result = parse_regulation_data(
            response_content, request.product_type, request.market
        )

        if success:
            return result
        else:
            # If parsing failed, return the error result (not raising an exception)
            # This helps with debugging by returning the raw response
            return result

    except OpenAIError as e:
        error_msg = f"OpenAI API error: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)
