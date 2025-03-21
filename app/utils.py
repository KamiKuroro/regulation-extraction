"""
Utility functions for the regulation extraction application.
"""

import json
import logging

logger = logging.getLogger(__name__)


def clean_json_content(content: str) -> str:
    """
    Cleans JSON content by removing Markdown code block formatting.

    Args:
        content (str): The raw response content possibly containing Markdown formatting

    Returns:
        str: Cleaned JSON string ready for parsing
    """
    # If it starts with ```json or ```JSON
    if content.strip().startswith("```json") or content.strip().startswith("```JSON"):
        # Remove ```json from the beginning
        cleaned = content.replace("```json", "", 1).replace("```JSON", "", 1)
        # Remove ``` from the end if present
        if cleaned.strip().endswith("```"):
            cleaned = cleaned[: cleaned.rstrip().rfind("```")]
        # Trim any whitespace
        cleaned = cleaned.strip()
        return cleaned

    # If it just has ``` but not json specifically
    if content.strip().startswith("```") and content.strip().endswith("```"):
        # Remove first line if it only contains ```
        lines = content.strip().split("\n")
        if lines[0].strip() == "```":
            lines = lines[1:]
        # Remove last line if it only contains ```
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        # Join the remaining lines
        cleaned = "\n".join(lines)
        return cleaned

    # Return unchanged if no Markdown formatting detected
    return content


def parse_regulation_data(content: str, product_type: str, market: str):
    """
    Parses the JSON response from OpenAI and validates its structure.
    
    Args:
        content (str): The cleaned JSON content
        product_type (str): The type of product
        market (str): The target market
        
    Returns:
        tuple: (success (bool), result (dict or error message))
    """
    from app.models import MarketRequirementsResponse  # Import here to avoid circular imports
    
    try:
        # Clean the content first
        cleaned_content = clean_json_content(content)
        logger.info(f"Cleaned JSON content (length: {len(cleaned_content)} chars)")
        
        # Parse the JSON
        regulation_data = json.loads(cleaned_content)
        
        # Validate the structure
        if "requirements" not in regulation_data or "summary" not in regulation_data:
            logger.error(f"Invalid response structure: {regulation_data.keys()}")
            return False, {
                "product_type": product_type,
                "market": market,
                "error": "API response missing required fields",
                "raw_response": cleaned_content,
            }
        
        # Create the structured response
        response = MarketRequirementsResponse(
            product_type=product_type,
            market=market,
            requirements=regulation_data["requirements"],
            summary=regulation_data["summary"],
        )
        
        return True, response
        
    except json.JSONDecodeError as e:
        error_msg = f"JSON parsing error: {str(e)}"
        logger.error(error_msg)
        logger.error(f"Failed to parse content")
        
        return False, {
            "product_type": product_type,
            "market": market,
            "error": error_msg,
            "raw_response": cleaned_content if 'cleaned_content' in locals() else content,
        } 