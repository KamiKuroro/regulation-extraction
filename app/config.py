"""
Configuration management for the regulation extraction application.
"""

import os
import yaml
import logging
from fastapi import HTTPException
from app.models import ConfigSettings

logger = logging.getLogger(__name__)


def load_config() -> ConfigSettings:
    """
    Load configuration from YAML file.
    
    Returns:
        ConfigSettings: Configuration settings
        
    Raises:
        HTTPException: If config file is not found or is invalid
    """
    config_path = os.getenv("CONFIG_PATH", "config.yaml")

    if not os.path.exists(config_path):
        logger.error(f"Config file not found at {config_path}")
        raise HTTPException(
            status_code=500, detail=f"Config file not found at {config_path}"
        )

    try:
        with open(config_path, "r") as file:
            config_data = yaml.safe_load(file)

        settings = ConfigSettings()
        settings.openai_api_key = config_data.get("openai_api_key")
        settings.model = config_data.get("model", "gpt-4o-search-preview")
        settings.max_tokens = config_data.get("max_tokens", 2000)
        settings.temperature = config_data.get("temperature", 0.2)

        if not settings.openai_api_key:
            logger.error("OpenAI API key not found in config")
            raise HTTPException(
                status_code=500, detail="OpenAI API key not found in config"
            )

        return settings
    except Exception as e:
        logger.error(f"Error loading config: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error loading config: {str(e)}") 