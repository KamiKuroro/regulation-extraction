# Test the clean_json_content function independently
from app.utils import clean_json_content
import json
import unittest
import sys
import os


class TestJsonCleaning(unittest.TestCase):
    """Test cases for the clean_json_content function."""
    
    def setUp(self):
        """Set up test cases before each test method."""
        # The Brazilian toy regulations example with markdown formatting
        self.markdown_json = """```json
{
    "requirements": [
        {
            "name": "INMETRO Certification",
            "description": "Mandatory certification by the National Institute of Metrology, Standardization, and Industrial Quality (INMETRO) to ensure toys meet Brazilian safety standards. This involves testing by accredited bodies and issuance of a Conformity Certificate and Identification Seal.",
            "category": "Certification",
            "source": "https://www.tuvsud.com/en-us/services/product-certification/inmetro/toys-childrens-products"
        },
        {
            "name": "ABNT NBR NM 300 Standards",
            "description": "A series of standards specifying safety requirements for toys, including mechanical and physical properties, flammability, chemical properties, and electrical safety.",
            "category": "Safety Standards",
            "source": "https://www.intertek.com/products-retail/insight-bulletins/2020/amendments-approved-on-quality-regulation-for-toys-and-school-articles/"
        },
        {
            "name": "Labeling Requirements",
            "description": "Labels must provide clear information in Portuguese about the product's quality, quantity, composition, price, shelf life, origin, and any health and safety risks. Metric units or their equivalents are required.",
            "category": "Labeling",
            "source": "https://www.trade.gov/country-commercial-guides/brazil-labelingmarking-requirements"
        },
        {
            "name": "Testing Requirements",
            "description": "Toys must undergo various tests, including mechanical and physical properties, flammability, chemical properties, phthalates determination, biological and toxicological testing, and electrical properties, to ensure safety compliance.",
            "category": "Testing",
            "source": "https://www.tuvsud.com/en-us/services/product-certification/inmetro/toys-childrens-products"
        },
        {
            "name": "Import Regulations",
            "description": "Importing toys requires a non-automatic import license (LI) from DECEX, obtained at least 15 days before cargo arrival. INMETRO certification must be presented during customs clearance.",
            "category": "Import Regulations",
            "source": "https://thebrazilbusiness.com/article/importing-toys-to-brazil"
        },
        {
            "name": "ANATEL Homologation for Electronic Toys",
            "description": "Electronic toys using radio frequency or wireless communication technologies must be homologated by ANATEL to ensure they do not interfere with telecommunications services.",
            "category": "Certification",
            "source": "https://techinbrazil.com/anatel-homologation-of-electronic-toys"
        }
    ],
    "summary": "To legally sell toys in Brazil, manufacturers and importers must obtain INMETRO certification, ensuring compliance with safety standards like ABNT NBR NM 300. Labels must be in Portuguese, detailing product information and safety warnings. Toys undergo rigorous testing for mechanical, chemical, and electrical safety. Importing requires a non-automatic license from DECEX, and electronic toys with wireless features need ANATEL homologation."
}
```"""

    def test_clean_markdown_json(self):
        """Test cleaning JSON with markdown formatting."""
        cleaned = clean_json_content(self.markdown_json)
        
        # Verify the content was cleaned
        self.assertNotIn("```json", cleaned)
        self.assertNotIn("```", cleaned)
        
        # Try to parse the JSON (will raise an exception if invalid)
        parsed = json.loads(cleaned)
        
        # Basic structure check
        self.assertIn("requirements", parsed)
        self.assertIn("summary", parsed)


if __name__ == '__main__':
    unittest.main()
