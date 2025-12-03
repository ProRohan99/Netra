import aiohttp
import ssl
from typing import Dict, Any
from vortex.core.scanner import BaseScanner

class HTTPScanner(BaseScanner):
    async def scan(self, target: str) -> Dict[str, Any]:
        # Ensure target has protocol
        if not target.startswith("http"):
            target = f"http://{target}"
            
        results = {}
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(target, ssl=False, timeout=5) as response:
                    results["status_code"] = response.status
                    results["headers"] = dict(response.headers)
                    results["server"] = response.headers.get("Server", "Unknown")
                    
                    # Basic tech stack fingerprinting based on headers
                    tech_stack = []
                    if "X-Powered-By" in response.headers:
                        tech_stack.append(response.headers["X-Powered-By"])
                    results["tech_stack"] = tech_stack
                    
        except Exception as e:
            results["error"] = str(e)
            
        return results
