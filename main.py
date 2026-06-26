from fastapi import Depends, FastAPI , HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import session, engine
from models import Product as ProductSchema, UserResponse
import database_models
from sqlalchemy.orm import Session
from models import UserCreate
from auth import hashed_password
from sqlalchemy.orm import Session
from models import UserLogin
from auth import verify_password, create_access_token, verify_token, create_refresh_token, decode_token
from fastapi.security import OAuth2PasswordBearer , OAuth2PasswordRequestForm
from models import Token
from models import Updaterole, Userrole
from logging_config import logger
from models import ProfileUpdate


# Alias DB model
ProductModel = database_models.Product

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://fastapi-project-roan-beta.vercel.app",
         "https://fastapi-project-git-main-ram-148s-projects.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if engine:
    database_models.Base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return "Welcome to Telusko Trac"


# Seed (initial) data
seed_products = [
    ProductSchema(id=1, name="phone ", description="A smartphone ", price=10000, quantity=50),
    ProductSchema(id=2, name="laptop ", description="A gaming laptop ", price=50000, quantity=20),
]


def get_db():
    if not session:
        raise Exception("Database not connected")

    db = session()
    try:
        yield db
    finally:
        db.close()


def init_db():
    if not session:
        return

    db = session()
    count = db.query(ProductModel).count()

    if count == 0:
        for seed_item in seed_products:
            db.add(ProductModel(**seed_item.model_dump()))

        db.commit()
    db.close()

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
   existing_user = db.query(database_models.User).filter(database_models.User.email == user.email).first()
   if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
   hash_password = hashed_password(user.password)
   db_user = database_models.User(username=user.username, email=user.email, password=hash_password)
   db.add(db_user)
   db.commit()
   db.refresh(db_user)
   return {"message": "User registered successfully", }

@app.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(database_models.User)\
                .filter(
                    database_models.User.email
                    == form_data.username
                )\
                .first()

    if not db_user:
        logger.warning(f"Failed login attempt for email: {form_data.username}")
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    if not db_user.is_active:
        logger.warning(f"Login attempt for disabled user: {form_data.username}")
        raise HTTPException(
            status_code=403,
            detail="User account is disabled"
        )

    if not verify_password(
        form_data.password,
        db_user.password
    ):
        logger.warning(f"Failed login attempt for email: {form_data.username}")
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": db_user.email}
    )
    refresh_token = create_refresh_token(
        data={"sub": db_user.email}
    )

    logger.info(f"User {db_user.email} logged in successfully.")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    
@app.post("/refresh")
def refresh_token(
    refresh_token: str
):

    payload = decode_token(
        refresh_token
    )

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Not a refresh token"
        )

    email = payload.get("sub")

    new_access_token = create_access_token(
        data={"sub": email}
    )

    return {
        "access_token": new_access_token
    }

    # The function get_current_user is a dependency that can be used in protected routes to retrieve the current authenticated user based on the provided token. It decodes the token, verifies its validity, and retrieves the user's email from the token payload. If the token is valid, it returns the email; otherwise, it returns None.
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    email = verify_token(token)
    
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(database_models.User).filter(database_models.User.email == email).first()
    
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    if not user.is_active:
     raise HTTPException(
        status_code=403,
        detail="Account disabled"
    )

    return user



def required_role(allowed_roles):
    def role_checker(current_user = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return current_user
    return role_checker


@app.get("/profile", response_model=UserResponse)
# The get_profile endpoint is a protected route that requires authentication. It uses the get_current_user dependency to retrieve the current authenticated user and returns their profile information, including their id, username, email, and role.
def get_profile(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }

@app.put("/profile")
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    current_user.username = profile_data.username

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }

@app.get("/products")
def get_all_products(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_product_records = db.query(ProductModel).all()
    return db_product_records


@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    db_product_record = db.query(ProductModel).filter(ProductModel.id == id).first()

    if db_product_record:
        return db_product_record

    return "product not found"


@app.post("/products")
def add_product(product_data: ProductSchema, db: Session = Depends(get_db), current_user = Depends(required_role(["manager","admin"]))):
    db.add(ProductModel(**product_data.model_dump()))
    db.commit()
    logger.info(f"Product {product_data.name} added successfully by user {current_user.email}.")
    return product_data


@app.put("/products/{id}")
def update_product(id: int, product_data: ProductSchema, db: Session = Depends(get_db),current_user = Depends(required_role(["manager","admin"]))):
    db_product_record = db.query(ProductModel).filter(ProductModel.id == id).first()

    if db_product_record:
        db_product_record.name = product_data.name
        db_product_record.description = product_data.description
        db_product_record.price = product_data.price
        db_product_record.quantity = product_data.quantity
        db.commit()
        logger.info(f"{current_user.email} updated product {id} successfully.")
        return "product updated successfully"
    else:
        return "product not found"


@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db), current_user = Depends(required_role(["admin"]))):
    db_product_record = db.query(ProductModel).filter(ProductModel.id == id).first()

    if db_product_record:
        db.delete(db_product_record)
        db.commit()
        logger.info(f"{current_user.email} deleted product {id} successfully.")
        return "product deleted successfully"
    else:
        return "product not found"
    
    
#this endpoint allows an admin user to update the role of a specific user by providing the user's ID and the new role data. It checks if the user exists, updates their role, and commits the changes to the database. If the user is not found, it raises a 404 HTTP exception.
@app.put("/users/{user_id}/role" )
def update_role(user_id: int, role_data:Updaterole, db: Session = Depends(get_db),current_user = Depends(required_role(["admin"]))):
    user = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # ADDED BY CLAUDE: block an admin from demoting their own account, which
    # would otherwise leave the system with no admin able to undo the change.
    if user.id == current_user.id and role_data.role.value != "admin":
        raise HTTPException(
            status_code=400,
            detail="You cannot change your own role away from admin"
        )
    user.role = role_data.role
    db.commit()
    logger.info(f"{current_user.email} updated user {user.id} role to {user.role}.")
    return {"message": "User role updated successfully", "new_role":user.role}

@app.get("/users", response_model=list[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user = Depends(required_role(["admin"]))):
    users = db.query(database_models.User).all()
    # ADDED BY CLAUDE: response_model=list[UserResponse] makes FastAPI 500
    # the *entire* request if even one row has a role value outside the
    # Userrole enum (e.g. a typo, blank string, or a value from before this
    # fix). Normalize any unrecognized role to "viewer" in memory only (not
    # written back to the DB) so the endpoint always returns successfully;
    # an admin can then correct the real value from the Users page.
    valid_roles = {r.value for r in Userrole}
    for u in users:
        if u.role not in valid_roles:
            u.role = "viewer"
    return users

#this endpoint allows an admin user to disable a specific user by providing the user's ID. It checks if the user exists, sets their is_active status to False, and commits the changes to the database. If the user is not found, it raises a 404 HTTP exception.
@app.put("/users/{user_id}/disable")
def disable_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(required_role(["admin"]))):
    # ADDED BY CLAUDE: block an admin from disabling their own account, which
    # would otherwise lock them out with no other admin able to re-enable it.
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot disable your own account"
        )
    user = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    logger.info(f"{current_user.email} disabled user {user.id}.")
    return {"message": "User disabled successfully", "user_id": user.id}

#this endpoint allows an admin user to enable a specific user by providing the user's ID. It checks if the user exists, sets their is_active status to True, and commits the changes to the database. If the user is not found, it raises a 404 HTTP exception.
@app.put("/users/{user_id}/enable")
def enable_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(
        required_role(["admin"])
    )
):

    user = db.query(
        database_models.User
    ).filter(
        database_models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.is_active = True

    db.commit()
    logger.info(f"{current_user.email} enabled user {user.id}.")

    return {
        "message": "User enabled"
    }

@app.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(
        required_role(["admin"])
    )
):
    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account"
        )
    user = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "user_id": user.id}

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db), current_user = Depends(required_role(["admin"]))):
    user = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.on_event("startup")
def startup_event():
    if session:
        init_db()


