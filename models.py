from pydantic import BaseModel
from enum import Enum

class Product(BaseModel):
    id: int 
    name: str
    description: str
    price: float
    quantity: int

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

# MODIFIED BY CLAUDE: the frontend (Sidebar, Products, Users pages) sends and
# expects "viewer" as the role name, but this enum only had "employee", so
# any role update from the UI failed validation and any existing row whose
# role didn't exactly match one of these three strings made GET /users
# raise a 500 (response_model validation failure), which is the root cause
# of the "axios error" on the Users page. "employee" is kept as a valid
# value too so old rows already in the database keep working without a
# migration; treat the two as equivalent everywhere in the app.
class Userrole(str, Enum):
    viewer = "viewer"
    employee = "employee"  # legacy alias for "viewer", kept for old rows
    manager = "manager"
    admin = "admin"

class Updaterole(BaseModel):
    role: Userrole


class ProfileUpdate(BaseModel):
    username: str


#this class is used to define the schema for the response when retrieving a user's profile information. It includes attributes for the user's id, username, email, role, and is_active status. The Config class with from_attributes set to True allows Pydantic to create an instance of UserResponse from an ORM model instance by reading the attributes directly.``
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: Userrole
    is_active: bool

    class Config:
        from_attributes = True