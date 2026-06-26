from sqlalchemy import Column, Integer, String, Float ,Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):


    __tablename__ = "product"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
    

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default = "viewer" )  # MODIFIED BY CLAUDE: was "employee"; frontend roles are viewer/manager/admin
    is_active = Column(Boolean, default=True)
