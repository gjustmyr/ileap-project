# Token Blacklist - Simple in-memory storage
# For production, use Redis or database table

from datetime import datetime
from typing import Set

class TokenBlacklist:
    """In-memory token blacklist for immediate token invalidation"""
    
    def __init__(self):
        self._blacklisted_tokens: Set[str] = set()
    
    def add_token(self, token: str) -> None:
        """Add a token to the blacklist"""
        self._blacklisted_tokens.add(token)
        print(f"🚫 Token blacklisted: {token[:20]}...")
    
    def is_blacklisted(self, token: str) -> bool:
        """Check if a token is blacklisted"""
        return token in self._blacklisted_tokens
    
    def remove_token(self, token: str) -> None:
        """Remove a token from the blacklist (for cleanup)"""
        self._blacklisted_tokens.discard(token)
    
    def clear_all(self) -> None:
        """Clear all blacklisted tokens"""
        self._blacklisted_tokens.clear()
    
    def get_count(self) -> int:
        """Get the number of blacklisted tokens"""
        return len(self._blacklisted_tokens)


# Global instance
token_blacklist = TokenBlacklist()
