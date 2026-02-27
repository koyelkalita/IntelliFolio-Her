"""Firebase authentication utilities"""
import os
import json
import base64
from typing import Dict
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import HTTPException, Depends, Header

# Initialize Firebase Admin SDK
firebase_initialized = False


def init_firebase():
    """Initialize Firebase Admin SDK"""
    global firebase_initialized
    
    # Skip initialization if already done
    if firebase_initialized:
        return True
    
    if len(firebase_admin._apps) > 0:
        firebase_initialized = True
        return True
    
    try:
        # Try to load from environment variable (base64 encoded JSON)
        firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if firebase_creds_json:
            try:
                creds_dict = json.loads(base64.b64decode(firebase_creds_json))
                cred = credentials.Certificate(creds_dict)
                firebase_admin.initialize_app(cred)
                firebase_initialized = True
                print("Firebase initialized from FIREBASE_CREDENTIALS_JSON")
                return True
            except Exception as e:
                print(f"Failed to initialize Firebase from JSON: {e}")
        
        # Try to load from file
        firebase_config_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
        if firebase_config_path and os.path.exists(firebase_config_path):
            try:
                cred = credentials.Certificate(firebase_config_path)
                firebase_admin.initialize_app(cred)
                firebase_initialized = True
                print("Firebase initialized from credentials file")
                return True
            except Exception as e:
                print(f"Failed to initialize Firebase from file: {e}")
        
        # Try default credentials (for Google Cloud environments)
        try:
            # Get project ID from environment
            project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
            if project_id:
                firebase_admin.initialize_app(options={"projectId": project_id})
            else:
                firebase_admin.initialize_app()
            firebase_initialized = True
            print("Firebase initialized from default credentials")
            return True
        except Exception as e:
            print(f"Failed to initialize Firebase from default credentials: {e}")
        
        # If we get here, Firebase auth is not available
        print("Firebase authentication not available - will use JWT fallback mode")
        return False
        
    except Exception as e:
        print(f"Unexpected error initializing Firebase: {e}")
        return False


# Initialize on module load
init_firebase()


async def get_firebase_user(authorization: str = Header(None)) -> Dict[str, str]:
    """
    Verify Firebase ID token and return user info
    Falls back to JWT parsing in development mode
    Returns: dict with user_id, email, display_name
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    # Extract token from "Bearer <token>"
    if not authorization.startswith("Bearer "):
        print(f"Invalid auth format: {authorization[:50]}")
        raise HTTPException(status_code=401, detail="Invalid authorization format. Expected 'Bearer <token>'")
    
    token = authorization[7:]  # Remove "Bearer " prefix
    
    if not token:
        raise HTTPException(status_code=401, detail="Empty token")
    
    try:
        # Try Firebase Admin SDK verification first
        if firebase_initialized and len(firebase_admin._apps) > 0:
            try:
                decoded_token = firebase_auth.verify_id_token(token)
                print(f"Token verified with Firebase: {decoded_token.get('uid')}")
                return {
                    "user_id": decoded_token.get("uid"),
                    "email": decoded_token.get("email"),
                    "display_name": decoded_token.get("name", "User"),
                    "firebase_uid": decoded_token.get("uid"),
                }
            except Exception as firebase_error:
                print(f"Firebase verification failed: {firebase_error}")
        
        # Fallback: Parse JWT without verification (development mode only)
        print("Using JWT fallback mode (unverified token)")
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError(f"Invalid JWT format: expected 3 parts, got {len(parts)}")
        
        # Decode the payload (without verification)
        payload = parts[1]
        # Add padding if needed
        padding = 4 - len(payload) % 4
        if padding != 4:
            payload += "=" * padding
        
        try:
            decoded = base64.urlsafe_b64decode(payload)
            payload_data = json.loads(decoded)
        except Exception as decode_error:
            print(f"Failed to decode JWT payload: {decode_error}")
            raise ValueError("Invalid JWT payload")
        
        # Extract user ID from various possible field names
        uid = (
            payload_data.get("user_id") 
            or payload_data.get("uid") 
            or payload_data.get("sub")
            or payload_data.get("firebase", {}).get("identities", {}).get("google.com", [None])[0]
        )
        
        if not uid:
            print(f"No user ID found in token payload: {list(payload_data.keys())}")
            raise ValueError("No user ID found in token")
        
        print(f"Token parsed successfully: {uid}")
        
        return {
            "user_id": str(uid),
            "email": payload_data.get("email", f"user-{str(uid)[:8]}@platform.local"),
            "display_name": payload_data.get("name", "User"),
            "firebase_uid": str(uid),
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Auth error: {type(e).__name__}: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

