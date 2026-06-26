from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError


SECRET_KEY = "change_this_later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRATION_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hashed_password(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data:dict, expires_delta: Optional[timedelta] = None):

    #create a copy of the data to avoid modifying the original dictionary
    to_encode = data.copy()

    #if expires_delta is provided, calculate the expiration time, otherwise use the default expiration time
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRATION_MINUTES)

        #add the expiration time to the data to be encoded in the token
    to_encode.update({"exp": expire, "type": "access"})

    #encode the data using the secret key and algorithm and return the generated jwt token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data:dict):
    #create a copy of the data to avoid modifying the original dictionary
    to_encode = data.copy()

    #calculate the expiration time for the refresh token
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    #add the expiration time to the data to be encoded in the token
    to_encode.update({"exp": expire, "type": "refresh"})

    #encode the data using the secret key and algorithm and return the generated jwt token
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(tokem:str):
    try:
        #decode the token using the secret key and algorithm
        payload = jwt.decode(tokem, SECRET_KEY, algorithms=[ALGORITHM])
        
        #extract the email from the token payload
        email = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None
    
def decode_token(token: str):
    try:
        #decode the token using the secret key and algorithm
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    
    except JWTError:
        return None 