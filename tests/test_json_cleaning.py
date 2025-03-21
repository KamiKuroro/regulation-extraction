# Test the clean_json_content function independently
from app.utils import clean_json_content
import json
import unittest


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

        # New test case for wooden decorations with surrounding text
        self.surrounded_json = """To legally import and sell wooden decorations in Brazil, compliance with various regulatory requirements, certifications, and standards is essential. Below is a comprehensive list of these requirements:

```json
{
    "requirements": [
        {
            "name": "INMETRO Certification",
            "description": "The National Institute of Metrology, Standardization, and Industrial Quality (INMETRO) mandates certification for products that may pose risks to health or the environment. While wooden decorations are not explicitly listed, it's advisable to verify if your specific product category requires this certification.",
            "category": "Certification",
            "source": "https://www.chinaimportal.com/blog/importing-products-to-brazil/"
        },
        {
            "name": "ISPM 15 Compliance for Wood Packaging",
            "description": "Wood packaging materials used in shipping must comply with the International Standards for Phytosanitary Measures No. 15 (ISPM 15). This includes treatment and marking to prevent the spread of pests. Non-compliance can result in the return of goods to the country of origin.",
            "category": "Import Regulation",
            "source": "https://www.gov.br/agricultura/pt-br/internacional/english/importing/introducao/cuidados-com-embalagens-e-transporte-dos-produtos-para-o-brasil"
        },
        {
            "name": "Labeling Requirements",
            "description": "Product labels must provide clear and precise information in Portuguese, including product name, composition, weight (in metric units), origin, price, shelf life, and any health or safety risks. This ensures consumers are well-informed about the products they purchase.",
            "category": "Labeling",
            "source": "https://www.trade.gov/country-commercial-guides/brazil-labelingmarking-requirements"
        },
        {
            "name": "Consumer Protection Code Compliance",
            "description": "The Brazilian Consumer Protection Code requires that products provide consumers with accurate information regarding quality, quantity, composition, price, guarantee, origin, expiration date, and potential health and safety risks.",
            "category": "Safety",
            "source": "https://santandertrade.com/en/portal/analyse-markets/brazil/packaging-and-standards"
        },
        {
            "name": "Import Licensing and Registration",
            "description": "Importers must register with the Foreign Trade Secretariat (SECEX) and may need to obtain an import license, depending on the product category. This process involves providing detailed information about the goods and ensuring compliance with Brazilian import regulations.",
            "category": "Import Regulation",
            "source": "https://www.chinaimportal.com/blog/importing-products-to-brazil/"
        },
        {
            "name": "Chemical and Material Safety Standards",
            "description": "Products must comply with safety standards set by regulatory bodies like ANVISA and INMETRO, ensuring that materials used do not pose health or environmental risks. This includes permissible levels of hazardous substances in consumer products.",
            "category": "Safety",
            "source": "https://generisonline.com/understanding-product-safety-and-labeling-standards-in-brazil/"
        }
    ],
    "summary": "To legally import and sell wooden decorations in Brazil, ensure compliance with INMETRO certification (if applicable), adhere to ISPM 15 standards for wood packaging, provide accurate labeling in Portuguese, follow the Consumer Protection Code, obtain necessary import licenses, and meet chemical and material safety standards."
}
```


It's crucial to consult with local authorities or compliance experts to confirm the specific requirements for your product category, as regulations may vary based on product specifics and are subject to change."""

    def test_clean_markdown_json(self):
        """Test cleaning JSON with Markdown formatting."""
        cleaned = clean_json_content(self.markdown_json)

        # Verify the content was cleaned
        self.assertNotIn("```json", cleaned)
        self.assertNotIn("```", cleaned)

        # Try to parse the JSON (will raise an exception if invalid)
        parsed = json.loads(cleaned)

        # Basic structure check
        self.assertIn("requirements", parsed)
        self.assertIn("summary", parsed)

    def test_clean_surrounded_json(self):
        """Test extracting JSON that's surrounded by descriptive text."""
        cleaned = clean_json_content(self.surrounded_json)

        # Try to parse the JSON
        parsed = json.loads(cleaned)

        # Structure check
        self.assertIn("requirements", parsed)
        self.assertIn("summary", parsed)

        # Check specific content to ensure we have the right data
        has_ispm = False
        for req in parsed["requirements"]:
            if req["name"] == "ISPM 15 Compliance for Wood Packaging":
                has_ispm = True
                self.assertEqual(req["category"], "Import Regulation")

        self.assertTrue(has_ispm, "ISPM requirement not found in parsed JSON")

        # Verify the summary is correctly extracted
        self.assertIn("wooden decorations in Brazil", parsed["summary"])


if __name__ == "__main__":
    unittest.main()
