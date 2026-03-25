import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

session = SessionLocal