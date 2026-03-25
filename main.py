from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import session, engine
from models import Product as ProductSchema
import database_models
from sqlalchemy.orm import Session

# Alias DB model
ProductModel = database_models.Product

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"]
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
    db = session()
    try:
        yield db
    finally:
        db.close()


def init_db():
    db = session()
    count = db.query(ProductModel).count()

    if count == 0:
        for seed_item in seed_products:
            db.add(ProductModel(**seed_item.model_dump()))

        db.commit()
    db.close()


@app.get("/products")
def get_all_products(db: Session = Depends(get_db)):
    db_product_records = db.query(ProductModel).all()
    return db_product_records


@app.get("/products/{id}")
def get_product_by_id(id: int, db: Session = Depends(get_db)):
    db_product_record = db.query(ProductModel).filter(ProductModel.id == id).first()

    if db_product_record:
        return db_product_record

    return "product not found"


@app.post("/products")
def add_product(product_data: ProductSchema, db: Session = Depends(get_db)):
    db.add(ProductModel(**product_data.model_dump()))
    db.commit()
    return product_data


@app.put("/products/{id}")
def update_product(id: int, product_data: ProductSchema, db: Session = Depends(get_db)):
    db_product_record = db.query(ProductModel).filter(ProductModel.id == id).first()

    if db_product_record:
        db_product_record.name = product_data.name
        db_product_record.description = product_data.description
        db_product_record.price = product_data.price
        db_product_record.quantity = product_data.quantity
        db.commit()
        return "product updated successfully"
    else:
        return "product not found"


@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product_record = db.query(ProductModel).filter(ProductModel.id == id).first()

    if db_product_record:
        db.delete(db_product_record)
        db.commit()
        return "product deleted successfully"
    else:
        return "product not found"


@app.on_event("startup")
def startup_event():
    init_db()