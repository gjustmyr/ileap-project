"""
API Stress Testing Script
Tests API endpoints under load to verify performance and generate traffic data for ML model training
"""

import asyncio
import aiohttp
import time
from datetime import datetime
import json
import statistics

# Configuration
API_BASE_URL = "http://localhost:8000"  # Change to your API URL
ENDPOINTS = [
    "/",  # Add your specific endpoints here
    # "/api/some-endpoint",
]
CONCURRENT_REQUESTS = 50  # Number of simultaneous requests
TOTAL_REQUESTS = 1000  # Total requests per endpoint
TIMEOUT = 30  # Request timeout in seconds


class StressTest:
    def __init__(self, base_url, endpoints, concurrent, total):
        self.base_url = base_url
        self.endpoints = endpoints
        self.concurrent = concurrent
        self.total = total
        self.results = []
        
    async def make_request(self, session, endpoint, request_num):
        """Make a single HTTP request and record metrics"""
        url = f"{self.base_url}{endpoint}"
        start_time = time.time()
        
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=TIMEOUT)) as response:
                await response.text()
                duration = time.time() - start_time
                
                return {
                    'endpoint': endpoint,
                    'request_num': request_num,
                    'status': response.status,
                    'duration': duration,
                    'timestamp': datetime.now().isoformat(),
                    'success': True
                }
        except Exception as e:
            duration = time.time() - start_time
            return {
                'endpoint': endpoint,
                'request_num': request_num,
                'status': 0,
                'duration': duration,
                'timestamp': datetime.now().isoformat(),
                'success': False,
                'error': str(e)
            }
    
    async def stress_endpoint(self, endpoint):
        """Stress test a single endpoint"""
        print(f"\n{'='*60}")
        print(f"Testing endpoint: {endpoint}")
        print(f"Concurrent requests: {self.concurrent}")
        print(f"Total requests: {self.total}")
        print(f"{'='*60}\n")
        
        results = []
        
        async with aiohttp.ClientSession() as session:
            for batch_start in range(0, self.total, self.concurrent):
                batch_size = min(self.concurrent, self.total - batch_start)
                
                # Create batch of concurrent requests
                tasks = [
                    self.make_request(session, endpoint, batch_start + i)
                    for i in range(batch_size)
                ]
                
                # Execute batch
                batch_results = await asyncio.gather(*tasks)
                results.extend(batch_results)
                
                # Progress indicator
                completed = batch_start + batch_size
                print(f"Progress: {completed}/{self.total} requests completed", end='\r')
        
        print()  # New line after progress
        return results
    
    def analyze_results(self, results):
        """Analyze and display test results"""
        if not results:
            print("No results to analyze")
            return
        
        successful = [r for r in results if r['success']]
        failed = [r for r in results if not r['success']]
        
        if successful:
            durations = [r['duration'] for r in successful]
            status_codes = {}
            
            for r in successful:
                status = r['status']
                status_codes[status] = status_codes.get(status, 0) + 1
            
            print(f"\n{'='*60}")
            print("RESULTS SUMMARY")
            print(f"{'='*60}")
            print(f"Total Requests:     {len(results)}")
            print(f"Successful:         {len(successful)} ({len(successful)/len(results)*100:.1f}%)")
            print(f"Failed:             {len(failed)} ({len(failed)/len(results)*100:.1f}%)")
            print(f"\nResponse Times:")
            print(f"  Min:              {min(durations):.3f}s")
            print(f"  Max:              {max(durations):.3f}s")
            print(f"  Mean:             {statistics.mean(durations):.3f}s")
            print(f"  Median:           {statistics.median(durations):.3f}s")
            
            if len(durations) > 1:
                print(f"  Std Dev:          {statistics.stdev(durations):.3f}s")
            
            print(f"\nStatus Codes:")
            for code, count in sorted(status_codes.items()):
                print(f"  {code}:              {count}")
            
            # Calculate requests per second
            total_duration = max(r['duration'] for r in results)
            rps = len(results) / total_duration if total_duration > 0 else 0
            print(f"\nRequests/Second:    {rps:.2f}")
            
        if failed:
            print(f"\nFailed Requests Details:")
            error_types = {}
            for r in failed:
                error = r.get('error', 'Unknown error')
                error_types[error] = error_types.get(error, 0) + 1
            
            for error, count in error_types.items():
                print(f"  {error}: {count}")
        
        print(f"{'='*60}\n")
        
        return {
            'total': len(results),
            'successful': len(successful),
            'failed': len(failed),
            'avg_duration': statistics.mean(durations) if durations else 0,
            'status_codes': status_codes if successful else {}
        }
    
    def save_results(self, all_results, filename='stress_test_results.json'):
        """Save detailed results to JSON file for ML training"""
        output_file = f"stress_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(output_file, 'w') as f:
            json.dump(all_results, f, indent=2)
        
        print(f"Detailed results saved to: {output_file}")
        return output_file
    
    async def run(self):
        """Run stress test on all endpoints"""
        print(f"\n{'#'*60}")
        print("API STRESS TEST")
        print(f"Base URL: {self.base_url}")
        print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'#'*60}")
        
        all_results = {}
        
        for endpoint in self.endpoints:
            results = await self.stress_endpoint(endpoint)
            summary = self.analyze_results(results)
            all_results[endpoint] = {
                'summary': summary,
                'detailed_results': results
            }
            
            # Small delay between endpoints
            await asyncio.sleep(1)
        
        # Save results for ML model
        self.save_results(all_results)
        
        print(f"\n{'#'*60}")
        print(f"STRESS TEST COMPLETE")
        print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'#'*60}\n")


async def main():
    """Main entry point"""
    stress_test = StressTest(
        base_url=API_BASE_URL,
        endpoints=ENDPOINTS,
        concurrent=CONCURRENT_REQUESTS,
        total=TOTAL_REQUESTS
    )
    
    await stress_test.run()


if __name__ == "__main__":
    print("Starting stress test...")
    print("Make sure your API is running!")
    print("Press Ctrl+C to stop\n")
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nStress test interrupted by user")
    except Exception as e:
        print(f"\n\nError during stress test: {e}")
