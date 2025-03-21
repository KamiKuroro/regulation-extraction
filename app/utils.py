"""
Utility functions for the regulation extraction application.
"""

import json
import logging

logger = logging.getLogger(__name__)


def clean_json_content(content: str) -> str:
    """
    Cleans JSON content by removing Markdown code block formatting and extracts
    valid JSON even when surrounded by descriptive text.

    Args:
        content (str): The raw response content possibly containing Markdown formatting
                      and surrounding text

    Returns:
        str: Cleaned JSON string ready for parsing
    """
    # Handle empty or None content
    if not content:
        return ""

    # First try to extract JSON from Markdown code blocks
    if "```" in content:
        # Extract content between code blocks
        # If it starts with ```json or ```JSON
        if "```json" in content or "```JSON" in content:
            start_marker = "```json" if "```json" in content else "```JSON"
            start_idx = content.find(start_marker) + len(start_marker)
            end_idx = content.find("```", start_idx)

            if end_idx > start_idx:
                return content[start_idx:end_idx].strip()

        # If it just has ``` but not json specifically
        start_idx = content.find("```") + 3
        end_idx = content.rfind("```")

        if end_idx > start_idx:
            potential_json = content[start_idx:end_idx].strip()
            # Check if this looks like valid JSON
            if (potential_json.startswith("{") and potential_json.endswith("}")) or (
                potential_json.startswith("[") and potential_json.endswith("]")
            ):
                return potential_json

    # If no markdown blocks or extraction failed, try to find JSON by looking for curly braces
    # This handles cases where JSON is embedded in descriptive text
    try:
        # Find the first opening brace
        open_brace_idx = content.find("{")
        if open_brace_idx >= 0:
            # Track nested braces to find the matching closing brace
            brace_count = 0
            in_string = False
            escape_next = False

            for i in range(open_brace_idx, len(content)):
                char = content[i]

                # Handle string boundaries
                if char == '"' and not escape_next:
                    in_string = not in_string

                # Handle escape sequences within strings
                if char == "\\" and in_string and not escape_next:
                    escape_next = True
                    continue
                escape_next = False

                # Count braces only when not in a string
                if not in_string:
                    if char == "{":
                        brace_count += 1
                    elif char == "}":
                        brace_count -= 1

                        # If we've found the matching closing brace
                        if brace_count == 0:
                            # Extract the JSON object
                            extracted_json = content[open_brace_idx : i + 1]

                            # Validate that it looks like proper JSON
                            try:
                                json.loads(extracted_json)
                                return extracted_json
                            except json.JSONDecodeError:
                                pass  # Not valid JSON, continue searching

    except Exception as e:
        logger.warning(f"Error while trying to extract JSON: {str(e)}")

    # If all extraction methods failed, return the original content
    # Let the JSON parser handle the error
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
    from app.models import (
        MarketRequirementsResponse,
    )  # Import here to avoid circular imports

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
            "raw_response": cleaned_content
            if "cleaned_content" in locals()
            else content,
        }
